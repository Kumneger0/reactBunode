import { doc, type Config } from 'prettier';
import { renderToString } from 'react-dom/server';

//@ts-expect-error
import * as rscDomWebpackClient from 'react-server-dom-webpack/client.browser.js';

import type { BuildOptions } from 'esbuild';
import { existsSync } from 'fs';
import { join } from 'path';
import React, { Suspense } from 'react';
import type { Module } from '../types/types';

export function sendNotFoundHTML() {
	const string = renderToString(<NotFoundPage />);
	return new Response(string, {
		headers: {
			'Content-Type': 'text/html'
		}
	});
}

function NotFoundPage() {
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

function ReduceComponets({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}

export async function getPageComponents(outdir: string, props: Record<string, any>) {
	const layoutPath = join(process.cwd(), '.reactbunode', 'dev', 'layout.js');
	const pagePath = join(outdir, 'page.js');
	const pageLayoutFile = join(outdir, 'layout.js');

	const pathsToDeleteCache = [pagePath, layoutPath, pageLayoutFile].filter((path) =>
		existsSync(path)
	);

	deleteDynamicImportCache(pathsToDeleteCache);

	const { default: Layout } = (await import(layoutPath)) as Module;
	const { default: PageLayout, rootLayoutNoWrap } = (
		existsSync(pageLayoutFile) ? await import(pageLayoutFile) : {}
	) as Module & {
		rootLayoutNoWrap: boolean;
	};
	const Page = (await import(pagePath)).default as Module['default'];

	if (rootLayoutNoWrap && !!PageLayout) {
		return (
			<>
				<PageLayout>
					<Suspense fallback={'loading'}>
						<Page {...props} />
					</Suspense>
				</PageLayout>
			</>
		);
	}

	const ReducedComponent = (
		<Layout>
			{!!PageLayout ? (
				<PageLayout>
					<Suspense fallback={'loading'}>
						<Page {...props} />
					</Suspense>
				</PageLayout>
			) : (
				<Suspense fallback={'loading'}>
					<Page {...props} />
				</Suspense>
			)}
		</Layout>
	);
	return ReducedComponent;
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
export function Content({ s1 }: { s1: ReadableStream }) {
	data ??= rscDomWebpackClient.createFromReadableStream(s1);
	//@ts-expect-error "Property 'use' does not exist on type 'typeof React'.ts(2339)"
	return React.use(data);
}

export function deleteDynamicImportCache(paths: Array<string>) {
	for (const path of paths) {
		delete require.cache[require.resolve(path)];
	}
}
