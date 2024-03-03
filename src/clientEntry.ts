import React from "react";
import * as ReactDOM from "react-dom/client";
//@ts-ignore

import * as ReactServerDOMReader from "react-server-dom-webpack/client";
import { rscStream } from "rsc-html-stream/client";

const root = ReactDOM.createRoot(document.body);

let data;
function Content() {
  data ??= ReactServerDOMReader.createFromReadableStream(rscStream);
  data.then((html: any) => {
    // @ts-ignore
    root.render(html);
    // ReactDOM.hydrateRoot(document?.body, html);
  });
}

Content();
