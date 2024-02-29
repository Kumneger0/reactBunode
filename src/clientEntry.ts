import React from "react";
import * as ReactDOM from "react-dom/client";
//@ts-ignore
import * as ReactServerDOMReader from "react-server-dom-webpack/client";
import { rscStream } from "rsc-html-stream/client";

let data;
function Content() {
  data ??= ReactServerDOMReader.createFromReadableStream(rscStream);
  data.then((html: any) => {
    ReactDOM.hydrateRoot(document.body, html);
    console.log("hydrated  hh");
  });
}

Content();
