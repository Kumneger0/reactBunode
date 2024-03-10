import { build as esbuild, type BuildOptions, type Plugin } from 'esbuild';
import { existsSync } from 'fs';
import { JSDOM } from 'jsdom';
import fs from 'node:fs/promises';
import { join, resolve } from 'path';
import * as prettier from 'prettier';
import React, { type FC } from 'react';

import * as rscDomWebpack from 'react-server-dom-webpack/server.edge.js';

import { build } from 'esbuild';
import { renderToReadableStream } from 'react-dom/server';
import * as rscDomWebpackClient from 'react-server-dom-webpack/client.browser.js';
import { injectRSCPayload } from 'rsc-html-stream/server';
import { formatConfig } from '../utils/utils';
import { parseTwClassNames } from './routeHadler';

const dir = resolve(process.cwd());

function getAppPath(baseDir: string) {
	return resolve(dir, baseDir);
}

const filesToGenerateSSG = ['layout.tsx', 'layout.jsx', 'page.tsx', 'page.jsx'] as const;

const entryPoints = new Set<string>();
export async function buildForProduction(baseDir = 'app') {
	const path = getAppPath(baseDir);
	const files = await fs.readdir(path);
	await Promise.all(
		files.map(async (file) => {
			const eachfileAbsolutePath = resolve(path, file);
			const stat = await fs.stat(eachfileAbsolutePath);
			if (stat.isDirectory()) {
				return await buildForProduction(join(baseDir, file));
			}
			if (
				stat.isFile() &&
				filesToGenerateSSG.includes(
					file.toLowerCase().trim() as (typeof filesToGenerateSSG)[number]
				)
			) {
				entryPoints.add(eachfileAbsolutePath);
			}
		})
	);
	return entryPoints;
}

export async function bundle(entryPoints: Set<string>) {
	await build({
		entryPoints: [...entryPoints],
		plugins: [generateStaticHTMLPlugin(), parseTwClassNames()],
		bundle: true,
		outdir: join(process.cwd(), 'dist'),
		packages: 'external',
		format: 'esm',
		allowOverwrite: true,
		keepNames: true
	});
}

const outdir = join(process.cwd(), 'dist');
const dynamicRouteRegEx = /\[[^\]\n]+\]$/gimsu;

const bundleFileNames = ['layout.js', 'page.js'];

function generateStaticHTMLPlugin(): Plugin {
	return {
		name: 'generate-static-html',
		setup(build) {
			build.onEnd(async (result) => {
				convertoHTML();
				async function convertoHTML(baseDir = 'dist') {
					if (baseDir == 'dist') readHtmlFromStreamAndSaveToDisk(outdir, {});

					const path = getAppPath(baseDir);
					const files = await fs.readdir(path);
					await Promise.all(
						files.map(async (file) => await handleEachDir({ file, baseDir, convertoHTML, path }))
					);
				}
			});
		}
	};
}

async function handleEachDir({ file, path, baseDir, convertoHTML }) {
	const eachfileAbsolutePath = resolve(path, file);
	const stat = await fs.stat(eachfileAbsolutePath);
	if (!stat.isDirectory() && !bundleFileNames.includes(file)) return;

	if (dynamicRouteRegEx.test(file)) {
		const { staticPaths } = (await import(join(path, file, 'page.js'))) as {
			staticPaths: Array<Record<string, any>>;
		};

		if (!staticPaths.length) return;

		staticPaths.map(async (prop, i) => {
			console.log(i);
			const html = await readHtmlFromStreamAndSaveToDisk(join(path, file), prop, false);
			if (!html) return;
			const dir = join(path, Object.values(prop).join('/'));
			if (existsSync(dir)) return;
			await fs.mkdir(dir);
			await fs.writeFile(join(dir, 'index.html'), html);
		});
		await readHtmlFromStreamAndSaveToDisk(join(path, file), {});
		return convertoHTML(join(baseDir, file));
	}
	if (stat.isDirectory()) {
		await readHtmlFromStreamAndSaveToDisk(join(path, file), {});
		return convertoHTML(join(baseDir, file));
	}
	return;
}

async function readHtmlFromStreamAndSaveToDisk(
	path: string,
	props: Record<string, any>,
	save = true
) {
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

interface BasePageProps {
	searchParams?: URL['searchParams'];
	children?: React.ReactNode;
}

type Module<T = {}> = {
	default: FC<T & BasePageProps>;
};

async function generatePagesStatically({
	Layout,
	Page,
	props
}: {
	Layout: Module['default'];
	Page: Module['default'];
	props: any;
}) {
	console.log(Page, props);

	const stream = rscDomWebpack.renderToReadableStream(
		<Layout>
			<Page {...props} />
		</Layout>
	);

	let [s1, s2] = stream.tee();

	let data: any;
	function Content() {
		data ??= rscDomWebpackClient.createFromReadableStream(s1);
		//@ts-expect-error
		return React.use(data);
	}

	let htmlStream = await renderToReadableStream(<Content />, {});

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
			if (images) {
				images.map((image) => {
					if (image.url) {
						dom.window.document.head.innerHTML += `<meta property="og:image" content="${image.url}" />`;
					}
				});
			}
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
