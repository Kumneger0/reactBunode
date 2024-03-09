import { file, type BuildConfig } from 'bun';
import fs from 'node:fs/promises';
import { resolve, join } from 'path';
import { build as esbuild } from 'esbuild';
import { clientResolver } from '../plugins/client-component-resolver';

async function build(config: BuildConfig) {
	try {
		const result = await Bun.build(config);
		return result;
	} catch (err) {
		err;
	}
}
const dir = resolve(process.cwd());

function getAppPath(baseDir: string) {
	return resolve(dir, baseDir);
}

async function handleBuild(baseDir, outDir) {
	buildRoutes(baseDir, outDir);
}

export async function buildRoutes(baseDir = 'app', outdir) {
	const path = getAppPath(baseDir);
	const files = await fs.readdir(path);
	files.forEach(async (file) => {
		const eachfileAbsolutePath = resolve(path, file);
		const stat = await fs.stat(eachfileAbsolutePath);
		if (stat.isDirectory()) {
			return buildRoutes(join(baseDir, file), outdir);
		}
		if (stat.isFile()) {
			const destinationDir =
				baseDir == 'app'
					? ''
					: (() => {
							const arrofPath = baseDir.split('/').slice(1);
							return join(...arrofPath);
					  })();
			watchFileChanges(eachfileAbsolutePath, destinationDir);
			const result = await esbuild({
				entryPoints: [path],
				outdir: join(process.cwd(), 'build'),
				plugins: [clientResolver],
				packages: 'external',
				format: 'esm',
				bundle: true,
				jsxDev: true
			});
		}
	});
}

async function watchFileChanges(filePath: string, destinationDir: string) {
	const { signal, abort } = new AbortController();

	const watcher = fs.watch(filePath, { signal });
	for await (const { eventType } of watcher) {
		if (eventType == 'change') {
			('---------------------------------------');
			`compiling ${filePath}`;

			await build({
				entrypoints: [filePath],
				minify: true,
				outdir: destinationDir
			});
			('done');
			('-----------------------------------------');
		}
	}
}

export { handleBuild };
