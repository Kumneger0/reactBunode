import { renderToString } from 'react-dom/server';
import { type Config } from 'prettier';
import * as rscDomWebpackClient from 'react-server-dom-webpack/client.browser.js';

import type { BuildOptions } from 'esbuild';
import { existsSync } from 'fs';
import { join } from 'path';
import React from 'react';

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
	console.log('out dir', outdir);
	const Layout = (await import(join(process.cwd(), 'build', 'layout.js'))).default;
	const Page = (await import(join(outdir, 'page.js'))).default;
	const Loading = existsSync(join(outdir, 'loading.js'))
		? (await import(join(outdir, 'loading.js'))).default
		: undefined;
	return { Layout, Page, Loading };
}

export const esbuildConfig: BuildOptions = {
	bundle: true,
	format: 'esm',
	allowOverwrite: true,
	keepNames: true,

	jsxDev: true
} as const;

export const formatConfig: Config = {
	parser: 'html',
	useTabs: true,
	singleQuote: true,
	printWidth: 100
};

let data: any;
export function Content({ s1 }) {
	data ??= rscDomWebpackClient.createFromReadableStream(s1);
	//@ts-expect-error "Property 'use' does not exist on type 'typeof React'.ts(2339)"
	return React.use(data);
}
