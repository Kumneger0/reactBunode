import { build as esbuild, type BuildOptions, type Plugin } from 'esbuild';
import { existsSync } from 'fs';
import { JSDOM } from 'jsdom';
import fs from 'node:fs/promises';
import { join, resolve } from 'path';
import * as prettier from 'prettier';
import React, { type FC } from 'react';
const postCssPlugin = require('esbuild-style-plugin');

//@ts-expect-error

import * as rscDomWebpack from 'react-server-dom-webpack/server.edge.js';

import { build } from 'esbuild';
import { renderToReadableStream } from 'react-dom/server';

//@ts-expect-error

import * as rscDomWebpackClient from 'react-server-dom-webpack/client.browser.js';
import { injectRSCPayload } from 'rsc-html-stream/server';
import { formatConfig, getConfig, getFiles } from '../utils/utils';

import type { TJSDOM } from '../types/types';

import type { Metadata } from '../types';

const dir = resolve(process.cwd());

function getAppPath(baseDir: string) {
	return resolve(dir, baseDir);
}

const filesToGenerateSSG = getFiles() as unknown as string[];

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
			if (stat.isFile() && filesToGenerateSSG.includes(file.toLowerCase().trim())) {
				entryPoints.add(eachfileAbsolutePath);
			}
		})
	);
	return entryPoints;
}

const { style, ...esbuildUserConfig } = await getConfig();

export async function bundle(entryPoints: Set<string>) {
	await build({
		...esbuildUserConfig,
		entryPoints: [...entryPoints],
		plugins: [
			generateStaticHTMLPlugin(),
			postCssPlugin(style?.postcss ? { postcss: style.postcss } : {})
		],
		bundle: true,
		outdir: join(process.cwd(), '.reactbunode', 'prd'),
		packages: 'external',
		format: 'esm',
		allowOverwrite: true,
		keepNames: true,
		loader: { '.png': 'file', '.jpg': 'file' }
	});
}

const outdir = join(process.cwd(), '.reactbunode', 'prd');
const dynamicRouteRegEx = /\[[^\]\n]+\]$/gimsu;

const bundleFileNames = ['layout.js', 'page.js'];

function generateStaticHTMLPlugin(): Plugin {
	return {
		name: 'generate-static-html',
		setup(build) {
			build.onEnd(async (result) => {
				convertoHTML();
				async function convertoHTML(baseDir = '.reactbunode/prd') {
					if (baseDir == '.reactbunode/prd') readHtmlFromStreamAndSaveToDisk(outdir, {});

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

type HandleDirProp = {
	file: string;
	path: string;
	baseDir: string;
	convertoHTML: (path: string) => void;
};
async function handleEachDir({ file, path, baseDir, convertoHTML }: HandleDirProp) {
	const eachfileAbsolutePath = resolve(path, file);
	const stat = await fs.stat(eachfileAbsolutePath);
	if (!stat.isDirectory() && !bundleFileNames.includes(file)) return;

	if (dynamicRouteRegEx.test(file)) {
		const { getStaticPaths } = (await import(join(path, file, 'page.js'))) as {
			getStaticPaths: (() => Promise<Array<Record<string, any>> | undefined>) | undefined;
		};

		if (!getStaticPaths) {
			console.error(`Please export async function named getStaticPaths from dynamic route
		 no function named getStaticPaths found in ${join(path, file, 'page.js')}
		
			`);
			process.exit(1);

			return;
		}

		const staticPaths = await getStaticPaths();

		if (!staticPaths) {
			console.error(`
	       getStaticPaths function in ${join(file, 'page.tsx')} route is not returning an array of objects, please check the documentation
		`);
			process.exit(1);
			return;
		}

		console.log(`trying to generate ${staticPaths.length} pages in route ${file}`);

		staticPaths?.map(async (prop, i) => {
			const html = await readHtmlFromStreamAndSaveToDisk(join(path, file), prop, false);
			if (!html) return;
			const dir = join(path, Object.values(prop).join('/'));
			if (existsSync(dir)) return;
			await fs.mkdir(dir);
			await fs.writeFile(join(dir, 'index.html'), html);
		});
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
			await addMetaData(await generatePagesStatically({ Layout, Page, props }), path, props),
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

async function addMetaData(
	html: string,
	path: string,
	props: Record<string, string>
): Promise<string> {
	const { metadata, generateMetadata } = (await import(join(path, 'page.js'))) as {
		metadata: Metadata | undefined;
		generateMetadata: (props?: Record<string, string>) => Promise<Metadata> | undefined;
	};

	const metataInfo = generateMetadata ? await generateMetadata(props) : metadata;

	const dom = new JSDOM(html) as TJSDOM;

	if (existsSync(join(path, 'page.css'))) {
		const link = dom.window.document.createElement('link');
		link.rel = 'stylesheet';
		link.href = './page.css';
		link.type = 'text/css';

		dom.window.document.head.appendChild(link);
	}

	const link = dom.window.document.createElement('link');
	link.rel = 'stylesheet';
	link.href = '/layout.css';
	link.type = 'text/css';
	dom.window.document.head.appendChild(link);

	if (!metataInfo) return dom.serialize();
	Object.keys(metataInfo).map((key) => {
		if (key == 'title' && metataInfo[key]) {
			if (dom.window.document.getElementsByTagName('title')[0]) {
				dom.window.document.getElementsByTagName('title')[0].textContent = metataInfo[key]!;
				return;
			}
			const title = dom.window.document.createElement('title');
			title.textContent = metataInfo[key]!;
			dom.window.document.head.appendChild(title);
		}
		if (typeof metataInfo[key as keyof typeof metadata] == 'string') {
			dom.window.document.head.innerHTML += `<meta property="og:${key}" content="${metataInfo[key as keyof typeof metadata]}" />`;
			dom.window.document.head.innerHTML += `<meta name="${key}" content="${metataInfo[key as keyof typeof metadata]}" />`;
		}
	});
	Object.keys(metataInfo?.openGraph ?? {})?.map((key) => {
		if (key == 'images') {
			const images = metataInfo.openGraph?.[key] as unknown as Array<Record<string, any>>;
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
