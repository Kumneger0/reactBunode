import { resolve } from 'path';
import { build as esbuild, type BuildOptions } from 'esbuild';

export async function buildPages(config: BuildOptions) {
	try {
		const result = await esbuild(config);
		return result;
	} catch (err) {
		console.log(err);
	}
}

async function buildClientEntry(entries: Set<String>) {
	if (!entries.size) return;
	const bunResult = await buildPages({
		entryPoints: [...(entries as unknown as string[])],
		format: 'esm',
		outdir: resolve(process.cwd(), 'build'),
		bundle: true,
		write: false,
		splitting: true
	});
}

export { buildPages as build };
