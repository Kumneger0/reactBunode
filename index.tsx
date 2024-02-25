import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { createElement, Suspense, type FC } from "react";
//@ts-ignore
import * as rscDomWebpack from "react-server-dom-webpack/server.browser";
//@ts-ignore
import * as rscDomWebpackClient from "react-server-dom-webpack/client";

import {
  renderToReadableStream,
  renderToPipeableStream,
  renderToString,
} from "react-dom/server";
import { handleBuild } from "./scripts/build.js";
import { stream as honoStream } from "hono/streaming";

const app = new Hono();

type Module<T = {}> = {
  default: FC<T>;
};

handleBuild();

app.use(
  "/build/*",
  serveStatic({
    root: "./",
    rewriteRequestPath: (path) => path.replace(/^\/build/, "/build"),
  })
);

app.get("/", async (c) => {
  const { default: Layout } = (await import("./build/layout.js")) as Module<{
    children: React.ReactNode;
  }>;

  const { default: App } = (await import(
    "./build/page.js"
  )) as unknown as Module;

  const { default: Loading } = (await import(
    "./build/loading.js"
  )) as unknown as Module;

  const stream = await rscDomWebpack.renderToReadableStream(
    <Layout>
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    </Layout>
  );

  const html = await rscDomWebpackClient.createFromReadableStream(stream);

  const secondStream = await renderToReadableStream(
    createElement(() => {
      return html;
    })
  );

  return honoStream(c, async (streamApi) => {
    streamApi.onAbort(() => {
      console.log("aborted");
    });
    await streamApi.pipe(secondStream);
  });

  return new Response(secondStream, {
    headers: {
      "Content-Type": "text/html",
    },
  });
});

app.get("/rsc", async (c) => {
  const { default: App } = (await import(
    "./build/page.js"
  )) as unknown as Module;

  const { default: Loading } = (await import(
    "./build/loading.js"
  )) as unknown as Module;
  const element = await rscDomWebpack.renderToReadableStream(
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  );
});

export default {
  port: 3000,
  fetch: app.fetch,
};
