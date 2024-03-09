import { join } from 'path';
import { build as esbuild } from 'esbuild';

await esbuild({
	entryPoints: [join(process.cwd(), 'index.tsx')],
	bundle: true,
	outdir: join(process.cwd(), 'dist'),
	format: 'esm',
	packages: 'external'
});

await esbuild({
	entryPoints: [join(process.cwd(), 'root-client.tsx')],
	bundle: true,
	outdir: join(process.cwd(), 'dist'),
	format: 'esm'
});

console.log('Build successful!');
