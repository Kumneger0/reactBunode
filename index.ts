import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { createElement } from "react";
import { build } from "./scripts/build.js";

import * as rscDomWebpack from "react-server-dom-webpack/server.browser";

const app = new Hono();

app.use(
  "/build/*",
  serveStatic({
    root: "./",
    rewriteRequestPath: (path) => path.replace(/^\/build/, "/build"),
  })
);

app.get("/", (c) =>
  c.html(`
       <!DOCTYPE html>
          <html>
             <body>
               <div id = "root"></div>
               <script>
               window.__webpack_require__ = async (id) => {
                    return import(id);
};
               </script>
               <script type = "module" src = "/build/client.js"></script>
             </body>

          </html>
`)
);

app.get("/rsc", async (c) => {
  const module = await import("./build/page.js");

  const element = rscDomWebpack.renderToReadableStream(
    createElement(module.default)
  );

  console.log(element);

  return new Response(element);
});

console.log(`server runnin on port 3000`);

export default {
  port: 3000,
  fetch: app.fetch,
};
