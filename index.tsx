import { Hono } from "hono";
import { serveStatic } from "hono/bun";
declare module "react" {
  export const use: <T extends Promise<unknown>>(arg: T) => T;
}

import React, { Suspense } from "react";
//@ts-ignore
import * as rscDomWebpack from "react-server-dom-webpack/server.browser";
//@ts-ignore
import * as rscDomWebpackClient from "react-server-dom-webpack/client";

import { renderToReadableStream, renderToString } from "react-dom/server";
import { injectRSCPayload } from "rsc-html-stream/server";
import { routeHandler } from "./lib/routeHadler.js";
import { existsSync } from "fs";

import { join } from "path";

const app = new Hono();

//handle api route endpoints

app.use("/api/*", async (c, next) => {
  const pathname = new URL(c.req.url).pathname;
  const reqMethod = c.req.method;
  const endpointFilePath = join(process.cwd(), "app", pathname, "route.ts");

  if (!existsSync(endpointFilePath)) return sendNotFoundHTML();

  const module = (await import(endpointFilePath)) as {
    [k: string]: (req: Request) => Response;
  };
  const endpointFuncions = Object.fromEntries(
    Object.keys(module).map((key) => {
      const method = key?.toLowerCase();
      return [method, module[key]];
    })
  );

  if (!endpointFuncions[reqMethod?.toLowerCase()]) return sendNotFoundHTML();

  return endpointFuncions[reqMethod.toLowerCase()](c.req.raw);
});

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

  let data;
  function Content() {
    data ??= rscDomWebpackClient.createFromReadableStream(s1);
    return React.use(data);
  }

  let htmlStream = await renderToReadableStream(<Content />, {
    bootstrapModules: ["/build/clientEntry.js"],
    bootstrapScripts: ["/build/webpackrequire.js"],
  });

  let response = htmlStream.pipeThrough(injectRSCPayload(s2));

  console.log("responce", response);

  return new Response(response);
});

export default {
  port: 3000,
  fetch: app.fetch,
};

console.log("server running ");

const result = await Bun.build({
  entrypoints: ["./src/clientEntry.ts"],
  outdir: "./build",
  target: "browser",
});

function APINoutFOundPage() {
  return (
    <html>
      <body
        style={{
          width: "100dvw",
          height: "100dvh",
          backgroundColor: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}>
        <h1
          style={{
            color: "white",
          }}>
          404 | NOT FOUND
        </h1>
      </body>
    </html>
  );
}

function sendNotFoundHTML() {
  const string = renderToString(<APINoutFOundPage />);
  return new Response(string, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
