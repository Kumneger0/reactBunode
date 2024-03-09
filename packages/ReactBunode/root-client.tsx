import * as ReactDOM from 'react-dom/client';
import * as ReactServerDOMReader from 'react-server-dom-webpack/client';
import { rscStream } from 'rsc-html-stream/client';
var data = await ReactServerDOMReader.createFromReadableStream(rscStream);
ReactDOM.hydrateRoot(document, data);
