import type { FC } from 'react';

declare module 'react-server-dom-webpack' {
	module 'client.browser.js' {
		export function createFromReadableStream(stream: ReadableStream): void;
	}
	module 'server.edge.js' {
		export function renderToReadableStream(RSC: FC): ReadableStream;
	}
}
