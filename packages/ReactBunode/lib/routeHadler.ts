import { parse } from 'es-module-lexer';
import type { BuildResult, Plugin } from 'esbuild';
import { build } from 'esbuild';
import { existsSync, readdirSync, statSync } from 'fs';
import { writeFile } from 'fs/promises';
import type { HonoRequest } from 'hono';
import { readFile } from 'node:fs/promises';
import { relative } from 'node:path';
import { join, resolve as nodeResolve } from 'path';
import { twj } from 'tw-to-css';
import { clientResolver } from '../plugins/client-component-resolver';
import { esbuildConfig } from './../utils/utils';
export const clientEntryPoints = new Set<string>();

/**
 * Handles routing and building pages for the React app.
 *
 * Parses the request URL and path to determine the page to render. Checks if pages and layouts exist on disk. Builds pages, layout, and client bundles with esbuild. Returns props and client component map for rendering.
 */
export async function routeHandler(req: HonoRequest) {
	const url = new URL(req.url);
	const searchParams = url.searchParams;

	await isAppropriateFilesExist(url);

	const currentPath = join(process.cwd(), 'app', url.pathname);

	const isPathExists = existsSync(currentPath);

	let dynamicRouteStatus: ReturnType<typeof checkCurrentRouteDynamicStatus> | null = null;

	if (!isPathExists) {
		dynamicRouteStatus = checkCurrentRouteDynamicStatus(url);
	}

	const splitedPathName = url.pathname.split('/').slice(0, -1).join('/');

	const componentPath = dynamicRouteStatus?.isDynamic
		? join(process.cwd(), 'app', splitedPathName, dynamicRouteStatus?.path)
		: currentPath;

	const loadingFilePath = join(componentPath, 'loading.tsx');
	const pagePath = join(componentPath, 'page.tsx');
	const rootLayoutPath = join(process.cwd(), 'app', 'layout.tsx');

	const outdir = dynamicRouteStatus?.isDynamic
		? join(process.cwd(), 'build', splitedPathName, dynamicRouteStatus.path)
		: join(process.cwd(), 'build', url.pathname);

	const unfillteredPagePaths = [
		{ path: pagePath, type: 'page' as const, outdir },
		{
			path: rootLayoutPath,
			type: 'layout' as const,
			outdir: join(process.cwd(), 'build')
		},
		{ path: loadingFilePath, type: 'loading' as const, outdir }
	];

	const pageComponents = unfillteredPagePaths.filter(({ path }) => existsSync(path));

	for (const { path, outdir } of pageComponents) {
		const result = await build({
			...esbuildConfig,
			entryPoints: [path],
			outdir: outdir,
			plugins: [clientResolver, parseTwClassNames()],
			packages: 'external',
			jsxFactory: 'jsx'
		});
	}

	const clientResult = await build({
		...esbuildConfig,
		entryPoints: [...clientEntryPoints],
		plugins: [parseTwClassNames()],
		outdir: nodeResolve(process.cwd(), 'build'),
		write: false
	});

	const clientComponentMap = await appendClientBuildReactMetaData(clientResult!);

	const props: Record<string, any> = { searchParams };

	props[dynamicRouteStatus?.slug as keyof typeof props] = decodeURIComponent(
		url.pathname.split('/').at(-1) as string
	);

	return {
		props,
		clientComponentMap,
		outdir
	};
}

/**
 * Checks if the current route is a dynamic route based on the URL pathname.
 * Returns an object indicating if it is a dynamic route, the matched path,
 * and the extracted slug if it is a dynamic route.
 *
 * Checks the pathname against a regex to see if it ends in brackets like
 * [slug]. If so, iterates through the nested route folders to find the one
 * matching the dynamic pattern. Extracts the slug by removing the brackets.
 */
function checkCurrentRouteDynamicStatus(url: URL) {
	const dynamicRouteRegEx = /\[[^\]\n]+\]$/gimsu;

	let dynamicRouteStatus = {
		isDynamic: false,
		path: ''
	} as Record<string, string | boolean>;

	const splitedPathName = url.pathname.split('/').slice(0, -1).join('/');
	const pathsToCheckDynicRoute = join(process.cwd(), 'app', splitedPathName);

	readdirSync(pathsToCheckDynicRoute).forEach(async (path) => {
		const isDir = statSync(join(pathsToCheckDynicRoute, path)).isDirectory();
		const isDynamic = isDir && dynamicRouteRegEx.test(path);
		if (isDynamic) {
			const removeSquereBrackets = path.replace('[', '').replace(']', '');
			dynamicRouteStatus = { isDynamic, path };
			dynamicRouteStatus.slug = removeSquereBrackets;
		}
	});
	return dynamicRouteStatus as {
		isDynamic: boolean;
		path: string;
		slug: string;
	};
}

async function isAppropriateFilesExist(url: URL) {
	const isrootLayoutExists = await existsSync(join(process.cwd(), 'app', 'layout.tsx'));

	if (!isrootLayoutExists) {
		throw new Error('please define root layout in app dir');
	}
}

/**
 * Appends metadata to client build result files to enable React hydration.
 *
 * For each output file in the client build result, parses exports and adds
 * metadata properties ($id, $typeof) to identify component references for
 * hydration. Writes updated file contents back to disk to include metadata.
 *
 * Returns a map of client component reference keys to metadata to pass to app
 * render function.
 */
async function appendClientBuildReactMetaData(clientResult: BuildResult) {
	const clientComponentMap = {};

	for (const { path, text } of clientResult?.outputFiles!) {
		const [, exports] = parse(text);
		let newContents = text;

		for (const exp of exports) {
			const key = path + exp.n;
			clientComponentMap[key] = {
				id: `/${relative(process.cwd(), path)}`,
				name: exp.n,
				chunks: [],
				async: true
			};

			newContents += `
          ${exp.ln}.$$id = ${JSON.stringify(key)};
          ${exp.ln}.$$typeof = Symbol.for("react.client.reference");
        `;
		}
		console.log(clientComponentMap);
		await writeFile(path, newContents);
		console.log('here');
	}
	return clientComponentMap;
}

export function parseTwClassNames(): Plugin {
	return {
		name: 'es-build-plugin-tw-classNames-to-inline-styles',
		setup(build) {
			build.onLoad({ filter: /\.(tsx|jsx)$/ }, async ({ path }) => {
				const contents = await readFile(path, 'utf-8');
				const processedHtml = contents.replace(/className="([^"]+)"/g, (match, classes) => {
					const inlineStyles = twj(classes);

					return `style={${JSON.stringify({ ...inlineStyles })}}`;
				});
				return { contents: processedHtml, loader: 'tsx' };
			});
		}
	};
}
