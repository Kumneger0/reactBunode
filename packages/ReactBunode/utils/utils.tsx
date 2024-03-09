import { renderToString } from 'react-dom/server';
import { resolve } from 'path';

//@ts-ignore
//@ts-ignore
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { BuildOptions } from 'esbuild';

export function sendNotFoundHTML() {
	const string = renderToString(<APINoutFOundPage />);
	return new Response(string, {
		headers: {
			'Content-Type': 'text/html'
		}
	});
}

function APINoutFOundPage() {
	return (
		<html>
			<body
				style={{
					width: '100dvw',
					height: '100dvh',
					backgroundColor: 'black',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					overflow: 'hidden'
				}}
			>
				<h1
					style={{
						color: 'white'
					}}
				>
					404 | NOT FOUND
				</h1>
			</body>
		</html>
	);
}

export async function getPageComponents(outdir: string) {
	const content = readFileSync(join(outdir, 'page.js'), 'utf-8');
	const Layout = (await import(join(process.cwd(), 'build', 'layout.js'))).default;
	const Page = (await import(join(outdir, 'page.js'))).default;
	const Loading = existsSync(join(outdir, 'loading.js'))
		? (await import(join(outdir, 'loading.js'))).default
		: undefined;
	return { Layout, Page, Loading };
}

export const esbuildConfig: BuildOptions = {
	bundle: true,
	packages: 'external',
	format: 'esm',
	allowOverwrite: true,
	keepNames: true,
	alias: {
		react: resolve(process.cwd(), 'node_modules', 'react'),
		'react-dom': resolve(process.cwd(), 'node_modules', 'react-dom')
	},

	jsxDev: true
} as const;
