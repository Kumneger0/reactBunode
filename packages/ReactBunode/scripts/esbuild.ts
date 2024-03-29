import { join } from 'path';
import { build as esbuild, context } from 'esbuild';

const configDir = join(process.cwd(), 'config', 'index.ts');

const serverContext = await esbuild({
	entryPoints: [join(process.cwd(), 'index.tsx'), configDir],
	bundle: true,
	outdir: join(process.cwd(), 'dist'),
	format: 'esm',
	packages: 'external',
	logLevel: 'info'
});

const clientContext = await esbuild({
	entryPoints: [join(process.cwd(), 'root-client.tsx')],
	bundle: true,
	outdir: join(process.cwd(), 'dist'),
	format: 'esm',
	logLevel: 'info'
});
