import { createElement } from "react";
import { renderToReadableStream, renderToString } from "react-dom/server";

const clientComponet = new Set();

async function build() {
  const result = await Bun.build({
    entrypoints: ["./app/page.tsx"],
    minify: true,
    target: "bun",
    format: "esm",
    outdir: "./build",
  });

  await Bun.build({
    entrypoints: ["./app/client.tsx"],
    minify: true,
    target: "browser",
    outdir: "./build",
    format: "esm",
  });
}
// @ts-ignore
const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    await build();
    const url = new URL(req.url);

    if (url.pathname == "/build/client.js") {
      const script = Bun.file("." + url.pathname);
      return new Response(script);
    }
    if (url.pathname === "/") {
      return new Response(
        `
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
          `,
        {
          headers: {
            "Content-type": "text/html",
          },
        }
      );
    }
    if (url.pathname === "/rsc") {
      console.log("request is comming");
      const module = await import("./build/page.js");
      const component = createElement(module.default);
      const page = renderToReadableStream(component);
      // const page = renderToString(component);
      console.log(page);
      return new Response(page);
    }
  },
});

console.log(`server runnin on port ${server.port}`);
