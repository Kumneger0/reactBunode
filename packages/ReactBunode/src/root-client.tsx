import * as ReactDOM from 'react-dom/client';
//@ts-expect-error
import React, { use, useState } from 'react';
import * as ReactServerDOMReader from 'react-server-dom-webpack/client';
import { rscStream } from 'rsc-html-stream/client';

// function ReadStream({ children }: { children: any }) {
// 	const [state, setState] = useState(0);
// 	console.log(state, 'state');
// 	return <>{children}</>;
// }

const data = await ReactServerDOMReader.createFromReadableStream(rscStream);

ReactDOM.hydrateRoot(document, data);
