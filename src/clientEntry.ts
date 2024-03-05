import React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

//@ts-ignore

import * as ReactServerDOMReader from "react-server-dom-webpack/client";
import { rscStream } from "rsc-html-stream/client";

console.log(rscStream);

let data;
function Content() {
  data ??= ReactServerDOMReader.createFromReadableStream(rscStream);
  console.log("data", data);
  data.then((html: any) => {
    // @ts-ignore
    ReactDOM.hydrateRoot(document?.body, html);
  });
}

Content();
