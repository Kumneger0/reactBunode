import * as ReactDOM from 'react-dom/client';

//@ts-expect-error "Could not find a declaration file for module 'react-server-dom-webpack/client"
import * as ReactServerDOMReader from 'react-server-dom-webpack/client';
import { rscStream } from 'rsc-html-stream/client';
var stream = ReactServerDOMReader.createFromReadableStream(rscStream);
//@ts-expect-error "Parameter 'data' implicitly has an 'any' type.ts(7006)"
stream.then((data) => {
	ReactDOM.hydrateRoot(document, data);
});

const ws = new WebSocket('ws://localhost:8080');

ws.addEventListener('open', (event) => {});

ws.addEventListener('message', (event) => {
	if (event.data == 'reload') {
		window.location.reload();
	}
});

ws.addEventListener('error', console.error);
