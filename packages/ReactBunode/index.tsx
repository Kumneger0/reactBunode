#!/usr/bin/env bun

import finalhandler from 'finalhandler';
import { readFileSync } from 'fs';
import { Hono } from 'hono';
import serveStatic from 'serve-static';

import { existsSync } from 'fs';
import http from 'http';
import importFresh from 'import-fresh';
import { join } from 'path';
import { renderToReadableStream } from 'react-dom/server';
//@ts-expect-error "Could not find a declaration file for module 'react-server-dom-webpack/server.edge.js"
import * as rscDomWebpack from 'react-server-dom-webpack/server.edge.js';
import { injectRSCPayload } from 'rsc-html-stream/server';
import Watchpack from 'watchpack';
import { WebSocketServer } from 'ws';
import { buildForProduction, bundle } from './lib/buildPages.js';
import { routeHandler } from './lib/routeHadler.js';
import { Content, getPageComponents, sendNotFoundHTML } from './utils/utils.js';

const app = new Hono();

const handers = {
	dev: devMode,
	build: async () => {
		console.log('building for production');
		const result = await buildForProduction();
		await bundle(result);
	},
	start
} as const;

const command = process.argv?.[2] as keyof typeof handers;

try {
	if (!(command in handers))
		throw new Error(`
	invalid command please choose 
	 reactBunode dev => to start dev server
	 reactBunode build => to build for production
	 reactBunode start => to server you static assets that is generated by reactBunode build
	 
	`);
	handers[command]();
} catch (err) {
	console.error(err);
}

if (command == 'dev') {
	const wss = new WebSocketServer({ port: 8080 });

	wss.on('connection', function connection(ws) {
		const wp = new Watchpack({
			aggregateTimeout: 500,
			poll: true,
			followSymlinks: true,
			ignored: ['.*']
		});

		wp.watch({
			directories: [join(process.cwd())]
		});

		wp.on('change', (filePath, mtime) => {
			console.log(`${filePath} changed`);
			ws.send('reload');
		});

		ws.on('error', console.error);

		ws.on('close', (code, reason) => wp.close());
	});
}

function devMode() {
	/**
	 * Handles API endpoint routing.
	 * Checks if endpoint file exists and handles routing to the appropriate handler function for the request method.
	 * Returns 404 if endpoint not found.
	 */

	app.use('/api/*', async (c, next) => {
		const pathname = new URL(c.req.url).pathname;
		const reqMethod = c.req.method;
		const endpointFilePath = join(process.cwd(), 'app', pathname, 'route.ts');

		if (!existsSync(endpointFilePath)) return sendNotFoundHTML();

		const module = (await importFresh(endpointFilePath)) as {
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

	app.use('/static/*', async (c) => {
		const header = c.req.header();
		if (!header.referer) return new Response('failed');

		const originPathname = new URL(header.referer).pathname;
		const pathname = new URL(c.req.url).pathname.split('/').slice(-1).at(0);
		if (!pathname) return;

		const filePath =
			pathname == 'layout.css'
				? join(process.cwd(), '.reactbunode', 'dev', pathname)
				: join(process.cwd(), '.reactbunode', 'dev', originPathname, pathname);

		const isFileExists = await Bun.file(filePath).exists();

		if (!isFileExists) return new Response('file not found');

		const file = Bun.file(filePath);
		return new Response(file);
	});

	app.get('/*', async (c) => {
		const url = new URL(c.req.url);
		if (url.pathname == '/favicon.ico') return;

		try {
			const handlerResult = await routeHandler(c.req);

			const { props, clientComponentMap, outdir } = handlerResult;

			const comp = await getPageComponents(outdir, props);

			const stream = rscDomWebpack.renderToReadableStream(comp, clientComponentMap);

			let [s1, s2] = stream.tee();

			const path = join(process.cwd(), 'node_modules', 'reactbunode', 'dist/root-client.js');

			const clientBootstrapScript = readFileSync(path, {
				encoding: 'utf-8'
			});

			let htmlStream = await renderToReadableStream(<Content s1={s1} />, {
				bootstrapScriptContent: `
                   window.__webpack_require__ = (id) => {
                      return import(id);
				   }
				   if (document.readyState == 'loading') {
                      	document.addEventListener('DOMContentLoaded', addStylesheet);
                      } else {
                      	addStylesheet();
                      }
                
                      function addStylesheet() {
                      	const linkPageCss = document.createElement('link');
                      	linkPageCss.rel = 'stylesheet';
                      	linkPageCss.href = '/static/page.css';
                      	linkPageCss.type = 'text/css';
                      	const linkLayoutCss = document.createElement('link');
                      	linkLayoutCss.rel = 'stylesheet';
                      	linkLayoutCss.href = '/static/layout.css';
                      	linkLayoutCss.type = 'text/css';
                        document.head.appendChild(linkLayoutCss);
                      	document.head.appendChild(linkPageCss);
                      };
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
	var serve = serveStatic(join(process.cwd(), '.reactbunode', 'prd'), {
		index: ['index.html', 'index.htm']
	});

	var server = http.createServer(function onRequest(req, res) {
		serve(req, res, finalhandler(req, res));
	});

	server.listen(4000, () => console.log('server running on port 4000'));
}

const devServer = command == 'dev' ? app : undefined;
export default devServer;
