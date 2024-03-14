import { join } from 'path';
import { build as esbuild, context } from 'esbuild';

const configDir = join(process.cwd(), 'config', 'index.ts');

const serverContext = await context({
	entryPoints: [join(process.cwd(), 'index.tsx'), configDir],
	bundle: true,
	outdir: join(process.cwd(), 'dist'),
	format: 'esm',
	packages: 'external',
	logLevel: 'info'
});

await serverContext.watch();

const clientContext = await context({
	entryPoints: [join(process.cwd(), 'root-client.tsx')],
	bundle: true,
	outdir: join(process.cwd(), 'dist'),
	format: 'esm',
	logLevel: 'info'
});

await clientContext.watch();

console.log('wathching');
