import { renderToString, renderToStaticMarkup, renderToReadableStream } from 'react-dom/server';
import { build as esbuild, type BuildOptions, type Plugin } from 'esbuild';
import { readdirSync, statSync } from 'fs';
import fs from 'node:fs/promises';
import { join, resolve } from 'path';
import { Suspense, createElement, startTransition } from 'react';
import { renderToStaticMarkupAsync, renderToStringAsync } from 'react-async-ssr';
import * as RSCWebPack from 'react-server-dom-webpack/server.edge';

console.log(RSCWebPack);

const reactComponentRegex = /\.(tsx|jsx)$/;

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

export async function buildForProduction(baseDir = 'app') {
	console.log('building for production');
	const path = getAppPath(baseDir);
	const files = await fs.readdir(path);
	files.forEach(async (file) => {
		const eachfileAbsolutePath = resolve(path, file);
		const stat = await fs.stat(eachfileAbsolutePath);
		if (stat.isDirectory()) {
			return buildForProduction(join(baseDir, file));
		}
		if (stat.isFile()) {
			console.log(file);
			const destinationDir =
				baseDir == 'app'
					? ''
					: (() => {
							const arrofPath = baseDir.split('/').slice(1);
							return join(...arrofPath);
					  })();
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
function generateStaticHTMLPlugin(): Plugin {
	return {
		name: 'generate-static-html',
		setup(build) {
			build.onResolve({ filter: reactComponentRegex }, async (arg) => {
				const filename = `${arg.path?.split('/')?.at(-1)?.split('.')[0]}`;
				console.log(arg);
				if (arg.kind == 'import-statement')
					return {
						external: true,
						path: `./${filename}.js`
					};
			});
			build.onEnd(async (result) => {
				async function convertoHTML(baseDir = 'dist') {
					const path = getAppPath(baseDir);
					const files = await fs.readdir(path);
					files.forEach(async (file) => {
						const eachfileAbsolutePath = resolve(path, file);
						const stat = await fs.stat(eachfileAbsolutePath);
						if (stat.isDirectory()) {
							return convertoHTML(join(baseDir, file));
						}
					});
				}
				try {
					currentCompiledFileCount += 1;
					if (currentCompiledFileCount == fileCount) {
						const { default: Layout } = await import(join(compiledFilePath, 'layout.js'));
						const { default: Page } = await import(join(compiledFilePath, 'page.js'));
						const { default: Loading } = await import(join(compiledFilePath, 'loading.js'));

						console.log(Layout, Page, Loading);

						const html = await renderToStaticMarkupAsync(
							createElement(Layout, {}, createElement(Page, {}))
						);
						console.log(html);
						await fs.writeFile(join(compiledFilePath, 'index.html'), html);
						console.log('done');
						convertoHTML();
					}
				} catch (err) {
					console.log(err);
				}
			});
		}
	};
}
let totalFiles = 0;

function countFilesInDirectory(directoryPath) {
	let count = 0;
	const items = readdirSync(directoryPath);

	items.forEach((item) => {
		const fullPath = `${directoryPath}/${item}`;
		if (statSync(fullPath).isDirectory()) {
			count += countFilesInDirectory(fullPath);
		} else {
			count++;
		}
	});

	return count;
}
