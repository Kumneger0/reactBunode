import { build as esbuild, type BuildOptions, type Plugin } from 'esbuild';
import { readdirSync, statSync, existsSync } from 'fs';
import fs from 'node:fs/promises';
import { join, resolve } from 'path';
import { type FC } from 'react';
import { JSDOM } from 'jsdom';
import React from 'react';
import * as prettier from 'prettier';

//@ts-ignore
import * as rscDomWebpack from 'react-server-dom-webpack/server.edge.js';
//@ts-ignore
import { build } from 'esbuild';
import { renderToReadableStream } from 'react-dom/server';
import * as rscDomWebpackClient from 'react-server-dom-webpack/client.browser.js';
import { injectRSCPayload } from 'rsc-html-stream/server';

export async function build(config: BuildOptions) {
	try {
		const result = await esbuild(config);
		return result;
	} catch (err) {
		console.log(err);
	}
}

const dir = resolve(process.cwd());

function getAppPath(baseDir: string) {
	return resolve(dir, baseDir);
}

const filesToGenerateSSG = ['layout.tsx', 'layout.jsx', 'page.tsx', 'page.jsx'] as const;

export async function buildForProduction(baseDir = 'app') {
	const path = getAppPath(baseDir);
	const files = await fs.readdir(path);
	files.forEach(async (file) => {
		const eachfileAbsolutePath = resolve(path, file);
		const stat = await fs.stat(eachfileAbsolutePath);
		if (stat.isDirectory()) {
			return buildForProduction(join(baseDir, file));
		}
		if (
			stat.isFile() &&
			filesToGenerateSSG.includes(file.toLowerCase().trim() as (typeof filesToGenerateSSG)[number])
		) {
			const destinationDir = baseDir == 'app' ? '' : join(...baseDir.split('/').slice(1));

			build({
				entryPoints: [eachfileAbsolutePath],
				plugins: [generateStaticHTMLPlugin()],
				outdir: join(dir, 'dist', destinationDir),
				bundle: true,
				packages: 'external',
				format: 'esm',
				allowOverwrite: true,
				keepNames: true
			});
		}
	});
}

const directoryPath = join(process.cwd(), 'app');
const fileCount = countFilesInDirectory(directoryPath);

const outdir = join(process.cwd(), 'dist');
let currentCompiledFileCount = 0;
const dynamicRouteRegEx = /\[[^\]\n]+\]$/gimsu;

const bundleFileNames = ['layout.js', 'page.js'];
function generateStaticHTMLPlugin(): Plugin {
	return {
		name: 'generate-static-html',
		setup(build) {
			build.onEnd(async (result) => {
				async function convertoHTML(baseDir = 'dist') {
					if (baseDir == 'dist') readHtmlFromStreamAndSaveToDisk(outdir, {});

					const path = getAppPath(baseDir);
					const files = await fs.readdir(path);
					await Promise.all(
						files.map(async (file) => {
							const eachfileAbsolutePath = resolve(path, file);
							const stat = await fs.stat(eachfileAbsolutePath);

							if (stat.isDirectory()) {
								if (dynamicRouteRegEx.test(file)) {
									const { staticPaths } = (await import(join(path, file, 'page.js'))) as {
										staticPaths: Array<Record<string, any>>;
									};
									if (staticPaths?.length) {
										staticPaths.map(async (prop) => {
											const html = await readHtmlFromStreamAndSaveToDisk(
												join(path, file),
												prop,
												false
											);
											if (html) {
												const dir = join(path, Object.values(prop).join('/'));
												if (!existsSync(dir)) {
													await fs.mkdir(dir);
													await fs.writeFile(join(dir, 'index.html'), html);
												}
											}
										});
										return;
									}
								}
								await readHtmlFromStreamAndSaveToDisk(join(path, file), {});
								return convertoHTML(join(baseDir, file));
							}
							if (bundleFileNames.includes(file)) {
								fs.rm(join(path, file));
							}
						})
					);
				}
				try {
					currentCompiledFileCount += 1;
					if (currentCompiledFileCount == fileCount) {
						convertoHTML().then(() => {
							console.log('done');
						});
					}
				} catch (err) {
					console.log(err);
				}
			});
		}
	};
}

const formatConfig = {
	parser: 'html',
	useTabs: true,
	singleQuote: true,
	printWidth: 100,
	overrides: [
		{
			options: {
				useTabs: false,
				tabWidth: 2
			}
		}
	]
};

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

function countFilesInDirectory(directoryPath: string) {
	let count = 0;

	const items = readdirSync(directoryPath);

	items.forEach((item) => {
		const fullPath = `${directoryPath}/${item}`;
		if (
			statSync(fullPath).isFile() &&
			filesToGenerateSSG.includes(item.toLowerCase().trim() as (typeof filesToGenerateSSG)[number])
		)
			return count++;
		if (statSync(fullPath).isDirectory()) {
			count += countFilesInDirectory(fullPath);
		}
	});

	return count;
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
			<Page id="this is test id" {...props} />
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
	const title = dom.window.document.getElementsByTagName('title')[0];
	if (title && metadata.title) {
		title.textContent = metadata.title;
	}
	if (!title && metadata.title) {
		dom.window.document.head.innerHTML += `<title>${metadata.title}</title>`;
		dom.window.document.head.innerHTML += `<meta property="og:title" content="${metadata.title}" />`;
	}
	if (metadata.openGraph) {
		Object.keys(metadata.openGraph).map((key) => {
			if (Array.isArray(metadata.openGraph[key])) {
				metadata.openGraph[key].forEach((v) => {
					if (key == 'images') {
						dom.window.document.head.innerHTML += `<meta property="og:${key}" content="${v.url}" />`;
					}
				});
			}
			if (typeof metadata.openGraph[key] == 'string') {
				dom.window.document.head.innerHTML += `<meta property="og:${key}" content="${metadata.openGraph[key]}" />`;
			}
		});
	}
	if (metadata.descreption) {
		dom.window.document.head.innerHTML += `<meta name="description" content="${metadata.descreption}" />`;
		dom.window.document.head.innerHTML += `<meta property="og:description" content="${metadata.descreption}" />`;
	}
	const result = dom.serialize();
	return result;
}

export const metadata = {
	title: 'this is string',
	descreption: 'this is descreption',
	openGraph: {
		images: [{ url: `og image url` }]
	}
} as const;

type Metadata = typeof metadata;
