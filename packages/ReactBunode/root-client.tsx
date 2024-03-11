import * as ReactDOM from 'react-dom/client';
import * as ReactServerDOMReader from 'react-server-dom-webpack/client';
import { rscStream } from 'rsc-html-stream/client';
var stream = ReactServerDOMReader.createFromReadableStream(rscStream);
stream.then((data) => {
	ReactDOM.hydrateRoot(document, data);
});
