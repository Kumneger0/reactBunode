import { existsSync, readdirSync, statSync } from 'fs';
import { JSDOM } from 'jsdom';
import fs from 'node:fs/promises';
import { join, resolve } from 'path';
import * as prettier from 'prettier';

import { build, type BuildOptions, type Plugin } from 'esbuild';
import { renderToReadableStream } from 'react-dom/server';

import * as rscDomWebpack from 'react-server-dom-webpack/server.edge.js';
import { injectRSCPayload } from 'rsc-html-stream/server';
import type { Module } from '../types/types';
import { Content, formatConfig } from '../utils/utils';
import { parseTwClassNames } from './routeHadler';

const dir = resolve(process.cwd());

function getAppPath(baseDir: string) {
	return resolve(dir, baseDir);
}

const filesToGenerateSSG = ['layout.tsx', 'layout.jsx', 'page.tsx', 'page.jsx'] as const;

const esbuildConfig: BuildOptions = {
	bundle: true,
	packages: 'external',
	format: 'esm',
	allowOverwrite: true,
	keepNames: true
};

const entryPoints = new Set<string>();
export async function buildForProduction(baseDir = 'app') {
	const path = getAppPath(baseDir);
	const files = readdirSync(path) as unknown as typeof filesToGenerateSSG;
	await Promise.all(
		files.map(async (file) => {
			const eachfileAbsolutePath = resolve(path, file);
			const stat = statSync(eachfileAbsolutePath);
			if (stat.isDirectory()) return await buildForProduction(join(baseDir, file));
			if (!stat.isFile() || !filesToGenerateSSG.includes(file)) return;
			entryPoints.add(eachfileAbsolutePath);
		})
	);
	return entryPoints;
}

export async function bundleApp(entryPoints: Set<string>) {
	const result = await build({
		entryPoints: [...entryPoints],
		plugins: [parseTwClassNames(), esbuildReactToHtmlPlugin()],
		outdir: join(process.cwd(), 'dist'),
		...esbuildConfig
	});
	console.log('done');
	return result;
}

function esbuildReactToHtmlPlugin(): Plugin {
	return {
		name: 'esbuildReactTohtmlPlugin',
		setup(build) {
			build.onEnd(() => {
				generateStaticHTMLPlugin();
			});
		}
	};
}

const bundleFileNames = ['layout.js', 'page.js'];

const outdir = join(process.cwd(), 'dist');
const dynamicRouteRegEx = /\[[^\]\n]+\]$/gimsu;

export async function generateStaticHTMLPlugin(baseDir = 'dist') {
	if (baseDir == 'dist') readHtmlFromStreamAndSaveToDisk(outdir, {});

	const path = getAppPath(baseDir);
	const files = readdirSync(path);
	await Promise.all(
		files.map(async (file) => {
			const eachfileAbsolutePath = resolve(path, file);
			const stat = await fs.stat(eachfileAbsolutePath);
			if (stat.isDirectory()) {
				await handleDirectory(file, path);
				return generateStaticHTMLPlugin(join(baseDir, file));
			}
			if (bundleFileNames.includes(file)) {
				fs.rm(join(path, file));
			}
		})
	);
}

async function handleDirectory(file: string, path: string) {
	if (dynamicRouteRegEx.test(file)) {
		await generateDynamicRoutes(path, file);
	}
	await readHtmlFromStreamAndSaveToDisk(join(path, file), {});
}

async function generateDynamicRoutes(path: string, file: string) {
	const { staticPaths } = (await import(join(path, file, 'page.js'))) as {
		staticPaths: Array<Record<string, any>>;
	};
	if (!staticPaths.length) return;

	staticPaths.map(async (prop, i) => {
		const html = await readHtmlFromStreamAndSaveToDisk(join(path, file), prop, false);
		if (!html) return;
		const dir = join(path, Object.values(prop).join('/'));
		if (existsSync(dir)) return;
		await fs.mkdir(dir);
		await fs.writeFile(join(dir, 'index.html'), html);
	});
	return;
}

async function readHtmlFromStreamAndSaveToDisk(
	path: string,
	props: Record<string, any>,
	save = true
) {
	console.log(path, 'path');

	const { default: Layout } = await import(join(outdir, 'layout.js'));
	if (await fs.exists(join(path, 'page.js'))) {
		const { default: Page } = await import(join(path, 'page.js'));
		const html = await prettier.format(
			await addMetaData(await generatePagesStatically({ Layout, Page, props }), path),
			formatConfig
		);

		if (!save) return html;
		await fs.writeFile(join(path, 'index.html'), html);
	}
}

type GeneratePagesStaticallyProps = {
	Layout: Module['default'];
	Page: Module['default'];
	props: any;
};
async function generatePagesStatically({ Layout, Page, props }: GeneratePagesStaticallyProps) {
	console.log(Page);

	const stream = rscDomWebpack.renderToReadableStream(
		<Layout>
			<Page {...props} />
		</Layout>
	);

	let [s1, s2] = stream.tee();

	let htmlStream = await renderToReadableStream(<Content s1={s1} />, {});

	let response = htmlStream.pipeThrough(injectRSCPayload(s2));
	let html = '';
	const reader = response.getReader();
	const Decoder = new TextDecoder();
	async function readHtml() {
		const { done, value } = await reader.read();
		html += Decoder.decode(value);
		if (!done) readHtml();
	}
	await readHtml();
	console.log(html);
	return html;
}

async function addMetaData(html: string, path: string): Promise<string> {
	const metadata = (await import(join(path, 'page.js'))).metadata as Metadata;
	const dom = new JSDOM(html) as { window: { document: Document }; serialize: () => string };
	if (!metadata) return html;
	Object.keys(metadata).map((key) => {
		if (key == 'title' && metadata[key]) {
			if (dom.window.document.getElementsByTagName('title')[0])
				dom.window.document.getElementsByTagName('title')[0].textContent = metadata[key]!;
			dom.window.document.head.innerHTML += `<meta property="og:title" content="${metadata.title}" />`;
			const title = dom.window.document.createElement('title');
			title.textContent = metadata[key]!;
			dom.window.document.head.appendChild(title);
			return;
		}
		if (typeof metadata[key] == 'string') {
			dom.window.document.head.innerHTML += `<meta property="og:${key}" content="${metadata[key]}" />`;
			dom.window.document.head.innerHTML += `<meta name="${key}" content="${metadata[key]}" />`;
		}
	});
	Object.keys(metadata?.openGraph ?? {})?.map((key) => {
		if (key == 'images') {
			const images = metadata.openGraph?.[key] as unknown as Array<Record<string, any>>;
			if (!images) return;
			images.map((image) => {
				if (image.url) {
					dom.window.document.head.innerHTML += `<meta property="og:image" content="${image.url}" />`;
				}
			});
		}
	});
	return dom.serialize();
}

export const metadata = {
	title: 'this is string',
	descreption: 'this is descreption',
	openGraph: {
		images: [{ url: `og image url` }]
	}
};
type Metadata = Partial<typeof metadata>;
