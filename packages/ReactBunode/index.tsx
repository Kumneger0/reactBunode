#!/usr/bin/env bun

import { readFileSync } from 'fs';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import React, { Suspense } from 'react';
//@ts-ignore
import * as rscDomWebpack from 'react-server-dom-webpack/server.edge.js';
//@ts-ignore
import { existsSync } from 'fs';
import { join } from 'path';

import { renderToReadableStream } from 'react-dom/server';
import * as rscDomWebpackClient from 'react-server-dom-webpack/client';
import { injectRSCPayload } from 'rsc-html-stream/server';
import { buildForProduction } from './lib/buildPages.js';
import { routeHandler } from './lib/routeHadler.js';
import { getPageComponents, sendNotFoundHTML } from './utils/utils.js';
const app = new Hono();

const handers = {
	dev: devMode,
	build: async () => {
		console.log('building for production');
		const result = await buildForProduction();
		console.log('production build complete');
	},
	start
} as const;

const command = process.argv?.[2] as keyof typeof handers;

try {
	handers[command]();
} catch (err) {
	console.error(err);
}

/**
 * Handles API endpoint routing.
 * Checks if endpoint file exists and handles routing to the appropriate handler function for the request method.
 * Returns 404 if endpoint not found.
 */

function devMode() {
	app.use('/api/*', async (c, next) => {
		const pathname = new URL(c.req.url).pathname;
		const reqMethod = c.req.method;
		const endpointFilePath = join(process.cwd(), 'app', pathname, 'route.ts');

		if (!existsSync(endpointFilePath)) return sendNotFoundHTML();

		const module = (await import(endpointFilePath)) as {
			[k: string]: (req: Request) => Response;
		};

		/**
		 * Creates an object mapping HTTP methods to handler functions from the route module.
		 * This allows lookup of the appropriate handler function for a given request method.
		 */
		const endpointFuncions = Object.fromEntries(
			Object.keys(module).map((key) => {
				const method = key?.toLowerCase();
				return [method, module[key]];
			})
		);

		if (!endpointFuncions[reqMethod?.toLowerCase()]) return sendNotFoundHTML();

		return endpointFuncions[reqMethod.toLowerCase()](c.req.raw);
	});

	app.use(
		'/build/*',
		serveStatic({
			root: './',
			rewriteRequestPath: (path) => path.replace(/^\/build/, '/build')
		})
	);

	app.get('/*', async (c) => {
		const url = new URL(c.req.url);
		if (url.pathname == '/favicon.ico') return;

		try {
			const handlerResult = await routeHandler(c.req);

			if (handlerResult instanceof Error) {
				if (handlerResult.message == 'not found') return sendNotFoundHTML();
				return new Response(handlerResult.message, { status: 500 });
			}
			const { props, clientComponentMap, outdir } = handlerResult;

			const { Layout, Loading, Page } = await getPageComponents(outdir);
			const stream = rscDomWebpack.renderToReadableStream(
				<Layout>
					<Suspense fallback={Loading ? <Loading /> : 'load'}>
						<Page {...props} />
					</Suspense>
				</Layout>,
				clientComponentMap
			);

			let [s1, s2] = stream.tee();

			let data: any;
			function Content() {
				data ??= rscDomWebpackClient.createFromReadableStream(s1);
				//@ts-expect-error
				return React.use(data);
			}

			const path = join(process.cwd(), 'node_modules', 'reactbunode', 'dist/root-client.js');

			const clientBootstrapScript = readFileSync(path, {
				encoding: 'utf-8'
			});

			let htmlStream = await renderToReadableStream(<Content />, {
				bootstrapScriptContent: `
                   window.__webpack_require__ = (id) => {
                      return import(id);
				   }
				   ${clientBootstrapScript}
				   `
			});

			let response = htmlStream.pipeThrough(injectRSCPayload(s2));
			return new Response(response, {
				headers: {
					'Content-Type': 'text/html'
				}
			});
		} catch (err) {
			console.error(err);
			if (err instanceof Error) {
				if (err.message == 'not found') return sendNotFoundHTML();
				return new Response(err.message, { status: 500 });
			}
		}
	});
	console.log('server started on port', 3000);
}

function start() {
	console.log('starting production server');
	app.use('/*', async (c) => {
		const url = new URL(c.req.url).pathname;
		return new Response(Bun.file(join(process.cwd(), 'dist', url, 'index.html')), {
			headers: {
				'Content-Type': 'text/html'
			}
		});
	});
}

const devServer = command == 'dev' || command == 'start' ? app : undefined;
export default devServer;
