import { Hono } from "hono";
import { serveStatic } from "hono/bun";
declare module "react" {
  export const use: <T extends Promise<unknown>>(arg: T) => T;
}

import React, { Suspense, use, type FC, createElement, useState } from "react";
//@ts-ignore
import * as rscDomWebpack from "react-server-dom-webpack/server.browser";
//@ts-ignore
import * as rscDomWebpackClient from "react-server-dom-webpack/client";

import { stream as honoStream } from "hono/streaming";
import { renderToReadableStream } from "react-dom/server";
import { routeHandler } from "./lib/routeHadler.js";
import { injectRSCPayload } from "rsc-html-stream/server";

const app = new Hono();

type Module<T = {}> = {
  default: FC<T>;
};

app.use(
  "/build/*",
  serveStatic({
    root: "./",
    rewriteRequestPath: (path) => path.replace(/^\/build/, "/build"),
  })
);

app.get("/*", async (c) => {
  const url = new URL(c.req.url);
  if (url.pathname == "/favicon.ico") return;
  const { Layout, Page, searchParams, Loading, clientComponentMap } =
    await routeHandler(c.req);

  const stream = rscDomWebpack.renderToReadableStream(
    <Layout>
      <Suspense fallback={Loading ? <Loading /> : "load"}>
        <Page searchParams={searchParams} />
      </Suspense>
    </Layout>,
    clientComponentMap
  );

  let [s1, s2] = stream.tee();
  let data;
  function Content() {
    data ??= rscDomWebpackClient.createFromReadableStream(s1);
    return React.use(data);
  }

  let htmlStream = await renderToReadableStream(<Content />, {
    bootstrapModules: ["/build/clientEntry.js"],
  });

  // Inject the RSC stream into the HTML stream.
  let response = htmlStream.pipeThrough(injectRSCPayload(s2));

  console.log(response);

  return new Response(response);

  //fake browser simulator
  const html = rscDomWebpackClient.createFromReadableStream(stream);

  const secondStream = await renderToReadableStream(
    createElement(() => {
      const [state, setState] = useState<any>();
      return (
        <div>
          {use(html)}
          <button onClick={() => setState(Math.random())}>{state}</button>
        </div>
      );
    }),
    {
      onError(error, errorInfo) {
        error;
        errorInfo;
      },
    }
  );

  return honoStream(c, async (streamApi) => {
    streamApi.onAbort(() => {
      ("aborted");
    });
    await streamApi.pipe(secondStream);
  });
});

export default {
  port: 3000,
  fetch: app.fetch,
};

// Render a component to RSC payload using bundler integration package.

// Fork the stream, and render it to HTML.

const result = await Bun.build({
  entrypoints: ["./build/clientEntry.js"],
  outdir: "./build",
});

console.log(result);
