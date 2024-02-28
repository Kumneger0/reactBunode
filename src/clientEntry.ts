import React from "react";
import { hydrateRoot } from "react-dom/client";
//@ts-ignore
import ReactServerDOMReader from "react-server-dom-webpack/client";
import { rscStream } from "rsc-html-stream/client";

let data;
function Content() {
  data ??= ReactServerDOMReader.createFromReadableStream(rscStream);
  data.then((html: any) => {
    hydrateRoot(document.body, html);
  });
}

Content();
