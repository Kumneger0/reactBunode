import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import React, { Suspense } from "react";
declare module "react" {
  export const use: <T extends Promise<unknown>>(arg: T) => T;
}
//@ts-ignore
import * as rscDomWebpack from "react-server-dom-webpack/server.edge.js";
//@ts-ignore
import { existsSync } from "fs";
import { renderToReadableStream, renderToString } from "react-dom/server";
import * as rscDomWebpackClient from "react-server-dom-webpack/client";
import { injectRSCPayload } from "rsc-html-stream/server";
import { routeHandler } from "../lib/routeHadler.js";

import { build as esbuild } from "esbuild";
import { join } from "path";
import { buildRoutes } from "../scripts/build.js";

const app = new Hono();

/**
 * Handles API endpoint routing.
 * Checks if endpoint file exists and handles routing to the appropriate handler function for the request method.
 * Returns 404 if endpoint not found.
 */
app.use("/api/*", async (c, next) => {
  const pathname = new URL(c.req.url).pathname;
  const reqMethod = c.req.method;
  const endpointFilePath = join(process.cwd(), "app", pathname, "route.ts");

  if (!existsSync(endpointFilePath)) return sendNotFoundHTML();

  const module = (await import(endpointFilePath)) as {
    [k: string]: (req: Request) => Response;
  };

  /**
   * Creates an object mapping HTTP methods to handler functions from the route module.
   * This allows lookup of the appropriate handler function for a given request method.
   */
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

  try {
    const handlerResult = await routeHandler(c.req);

    if (handlerResult instanceof Error) {
      if (handlerResult.message == "not found") return sendNotFoundHTML();
      return new Response(handlerResult.message, { status: 500 });
    }

    const { Layout, Page, props, Loading, clientComponentMap } = handlerResult;

    const stream = rscDomWebpack.renderToReadableStream(
      <Layout>
        <Suspense fallback={Loading ? <Loading /> : "load"}>
          <Page {...props} />
        </Suspense>
      </Layout>,
      clientComponentMap
    );

    console.log(clientComponentMap);

    let [s1, s2] = stream.tee();

    console.log(s1, s2);

    let data;
    function Content() {
      data ??= rscDomWebpackClient.createFromReadableStream(s1);
      return React.use(data);
    }

    let htmlStream = await renderToReadableStream(<Content />, {
      bootstrapModules: ["/build/root-client.js"],
      bootstrapScriptContent: `
      function __webpack_require__(id) {
       return import(id);
         }
      `,
    });

    let response = htmlStream.pipeThrough(injectRSCPayload(s2));

    return new Response(response);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message == "not found") return sendNotFoundHTML();
      return new Response(err.message, { status: 500 });
    }
  }
});

export default {
  port: 3000,
  fetch: app.fetch,
};

console.log("server running ");
// try {
//   const result = await esbuild({
//     entryPoints: [
//       join(process.cwd(), "node_modules/reactBunode/src/root-client.ts"),
//     ],
//     outdir: "./build",
//     bundle: true,
//     format: "esm",
//     jsx: "automatic",
//     plugins: [],
//   });
// } catch (err) {
//   console.error(err);
// }

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

buildRoutes();

function sendNotFoundHTML() {
  const string = renderToString(<APINoutFOundPage />);
  return new Response(string, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
