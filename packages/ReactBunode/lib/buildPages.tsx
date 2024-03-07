import { build as esbuild, type BuildOptions, type Plugin } from 'esbuild';
import { readdirSync, statSync, existsSync } from 'fs';
import fs from 'node:fs/promises';
import { join, resolve } from 'path';
import { type FC } from 'react';

import React from 'react';

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

const compiledFilePath = join(process.cwd(), 'dist');
let currentCompiledFileCount = 0;

const bundleFileNames = ['layout.js', 'page.js'];
function generateStaticHTMLPlugin(): Plugin {
	return {
		name: 'generate-static-html',
		setup(build) {
			build.onEnd(async (result) => {
				console.log('on edn');
				async function convertoHTML(baseDir = 'dist') {
					const { default: Layout } = await import(join(compiledFilePath, 'layout.js'));

					if (baseDir == 'dist') {
						const { default: Page } = await import(join(compiledFilePath, 'page.js'));
						const html = await generatePagesStatically({ Layout, Page, props: {} });
						await fs.writeFile(join(compiledFilePath, 'index.html'), html);
					}
					const path = getAppPath(baseDir);
					const files = await fs.readdir(path);
					await Promise.all(
						files.map(async (file) => {
							const eachfileAbsolutePath = resolve(path, file);
							const stat = await fs.stat(eachfileAbsolutePath);

							if (stat.isDirectory()) {
								if (await fs.exists(join(path, file, 'page.js'))) {
									const { default: Page } = await import(join(path, file, 'page.js'));
									const html = await generatePagesStatically({ Layout, Page, props: {} });
									await fs.writeFile(join(path, file, 'index.html'), html);
									bundleFileNames.map(async (fName) => {
										if (await fs.exists(join(path, file, fName))) {
											console.log('deleteing ', join(path, file, fName));
											await fs.rm(join(path, file, fName));
										}
									});
								}

								return convertoHTML(join(baseDir, file));
							}
						})
					);
				}
				try {
					currentCompiledFileCount += 1;
					if (currentCompiledFileCount == fileCount) {
						convertoHTML().then(() => {
							console.log('finished');
						});
					}
				} catch (err) {
					console.log(err);
				}
			});
		}
	};
}

function countFilesInDirectory(directoryPath) {
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
		if (!done) {
			readHtml();
		}
	}
	await readHtml();
	return html;
}
