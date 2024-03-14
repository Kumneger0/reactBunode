import { parse } from 'es-module-lexer';
import { build, type BuildResult } from 'esbuild';
import postCssPlugin from 'esbuild-style-plugin';
import { existsSync, readdirSync, statSync } from 'fs';
import { writeFile } from 'fs/promises';
import type { HonoRequest } from 'hono';
import { relative } from 'node:path';
import { join, resolve as nodeResolve } from 'path';
import type { ReactBunodeConfig } from '../config';
import { clientResolver } from '../plugins/client-component-resolver';
import { esbuildConfig } from './../utils/utils';
export const clientEntryPoints = new Set<string>();

/**
 * Handles routing and building pages for the React app.
 *
 * Parses the request URL and path to determine the page to render. Checks if pages and layouts exist on disk. Builds pages, layout, and client bundles with esbuild. Returns props and client component map for rendering.
 */
const configFile = join(process.cwd(), 'reactbunode.config.ts');

const tsConfigFilePath = join(process.cwd(), 'tsconfig.json');

const { style, ...esbuildUserConfig } = (
	existsSync(configFile) ? (await import(configFile)).default : {}
) as ReactBunodeConfig;

export const filesWeAreLookingFor = existsSync(tsConfigFilePath)
	? (['layout.tsx', 'page.tsx'] as const)
	: (['layout.jsx', 'page.jsx'] as const);

export async function routeHandler(req: HonoRequest) {
	const url = new URL(req.url);
	const searchParams = url.searchParams;

	await isAppropriateFilesExist();

	const currentPath = join(process.cwd(), 'app', url.pathname);

	const isPathExists = existsSync(currentPath);

	let dynamicRouteStatus: ReturnType<typeof checkCurrentRouteDynamicStatus> | null = null;

	if (!isPathExists) {
		dynamicRouteStatus = checkCurrentRouteDynamicStatus(url.pathname);
	}

	const splitedPathName = url.pathname.split('/').slice(0, -1).join('/');

	const componentPath = dynamicRouteStatus?.isDynamic
		? join(process.cwd(), 'app', splitedPathName, dynamicRouteStatus?.path)
		: currentPath;

	const page = filesWeAreLookingFor[1];
	const layout = filesWeAreLookingFor[0];

	const pagePath = join(componentPath, page);
	const rootLayoutPath = join(process.cwd(), 'app', layout);
	const pageLayoutPath = join(componentPath, layout);

	const outdir = dynamicRouteStatus?.isDynamic
		? join(process.cwd(), '.reactbunode', 'dev', splitedPathName, dynamicRouteStatus.path)
		: join(process.cwd(), '.reactbunode', 'dev', url.pathname);

	const unfillteredPagePaths = [pagePath, rootLayoutPath, pageLayoutPath];

	const filteredPagePathes = unfillteredPagePaths.filter((path) => existsSync(path));

	const result = await build({
		...esbuildUserConfig,
		...esbuildConfig,
		entryPoints: [...filteredPagePathes],
		outdir: join(process.cwd(), '.reactbunode', 'dev'),
		plugins: [clientResolver, postCssPlugin(style?.postcss ? { postcss: style.postcss } : {})],
		packages: 'external',
		jsxFactory: 'jsx'
	});

	const clientResult = await build({
		...esbuildUserConfig,
		...esbuildConfig,
		entryPoints: [...clientEntryPoints],
		plugins: [postCssPlugin(style?.postcss ? { postcss: style.postcss } : {})],
		outdir: nodeResolve(process.cwd(), '.reactbunode', 'dev'),
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
function checkCurrentRouteDynamicStatus(pathname: string) {
	const dynamicRouteRegEx = /\[[^\]\n]+\]$/gimsu;

	let dynamicRouteStatus = {
		isDynamic: false,
		path: ''
	} as Record<string, string | boolean>;

	const splitedPathName = pathname.split('/').slice(0, -1).join('/');
	const pathsToCheckDynicRoute = join(process.cwd(), 'app', splitedPathName);

	if (!existsSync(pathsToCheckDynicRoute)) throw new Error('not found');

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

async function isAppropriateFilesExist() {
	const isrootLayoutExists = existsSync(join(process.cwd(), 'app', filesWeAreLookingFor[0]));

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
	const clientComponentMap: Record<string, any> = {};

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
		await writeFile(path, newContents);
	}
	return clientComponentMap;
}
