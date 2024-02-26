import { Hono } from "hono";
import { serveStatic } from "hono/bun";
declare module "react" {
  export const use: <T extends Promise<unknown>>(arg: T) => T;
}

import { Suspense, type FC } from "react";
//@ts-ignore
import * as rscDomWebpack from "react-server-dom-webpack/server.browser";
//@ts-ignore
import * as rscDomWebpackClient from "react-server-dom-webpack/client";

import { stream as honoStream } from "hono/streaming";
import { renderToReadableStream } from "react-dom/server";
import { routeHandler } from "./lib/routeHadler.js";

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
      <Suspense fallback={Loading ? <Loading /> : null}>
        <Page searchParams={searchParams} />
      </Suspense>
    </Layout>,
    clientComponentMap
  );

  //fake browser simulator
  const html = await rscDomWebpackClient.createFromReadableStream(stream);

  console.log(html);

  const secondStream = await renderToReadableStream(html, {
    onError(error, errorInfo) {
      console.log(error);
      console.log(errorInfo);
    },
  });

  return honoStream(c, async (streamApi) => {
    streamApi.onAbort(() => {
      console.log("aborted");
    });
    await streamApi.pipe(secondStream);
  });
});

export default {
  port: 3000,
  fetch: app.fetch,
};
