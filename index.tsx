import { Hono } from "hono";
import { serveStatic } from "hono/bun";
declare module "react" {
  export const use: <T extends Promise<unknown>>(arg: T) => T;
}

import React, { Suspense } from "react";
//@ts-ignore
import * as rscDomWebpack from "react-server-dom-webpack/server.edge";
//@ts-ignore
import * as rscDomWebpackClient from "react-server-dom-webpack/client";

import { renderToReadableStream } from "react-dom/server";
import { injectRSCPayload } from "rsc-html-stream/server";
import { routeHandler } from "./lib/routeHadler.js";

const app = new Hono();

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

  const stream = await rscDomWebpack.renderToReadableStream(
    <Layout>
      <Suspense fallback={Loading ? <Loading /> : "load"}>
        <Page searchParams={searchParams} />
      </Suspense>
    </Layout>,
    clientComponentMap
  );

  let [s1, s2] = stream.tee();

  console.log("here", s1);

  let data;
  function Content() {
    data ??= rscDomWebpackClient.createFromReadableStream(s1);
    return React.use(data);
  }

  let htmlStream = await renderToReadableStream(<Content />, {
    bootstrapModules: ["/build/clientEntry.js"],
  });

  let response = htmlStream.pipeThrough(injectRSCPayload(s2));

  console.log("responce", response);

  return new Response(response);
});

export default {
  port: 3000,
  fetch: app.fetch,
};

const result = await Bun.build({
  entrypoints: ["./src/clientEntry.ts"],
  minify: true,
  outdir: "./build",
  target: "browser",
});
