import fs from "node:fs/promises";
import { join } from "path";
import type { HonoRequest } from "hono";
import React, { type ReactNode, type FC } from "react";
import { build } from "./_buildCurrentRoute";
import { type BunPlugin } from "bun";
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { parse } from "es-module-lexer";
import { relative } from "node:path";

interface BasePageProps {
  searchParams?: URL["searchParams"];
  children?: React.ReactNode;
}

type Module<T = {}> = {
  default: FC<T & BasePageProps>;
};

const clientEntryPoints = new Set<string>();

const reactComponentRegex = /\.tsx$/;

const clientResolver: BunPlugin = {
  name: "resolve-client-imports",
  setup(build) {
    // Intercept component imports to check for 'use client'

    console.log("trying to opt out client compont");

    build.onLoad({ filter: /\.(tsx|jsx)$/ }, async ({ path: relativePath }) => {
      console.log("relativePaht", relativePath);

      const path = resolve(relativePath);
      const contents = await readFile(path, "utf-8");

      console.log("has use client", contents.startsWith('"use client"'));

      if (contents.startsWith('"use client"')) {
        console.log("now true");
        clientEntryPoints.add(path);
        return {
          // Avoid bundling client components into the server build.
          external: true,
          // Resolve the client import to the built `.js` file
          // created by the client `esbuild` process below.
          path: relativePath.replace(reactComponentRegex, ".js"),
        };
      }
      console.log(clientEntryPoints);
    });
  },
};

export async function routeHandler(req: HonoRequest) {
  const url = new URL(req.url);

  const searchParams = url.searchParams;
  const currentPath = join(process.cwd(), "app", url.pathname);

  const pagePath = join(currentPath, "page.tsx");
  const loadingFilePath = join(currentPath, "loading.tsx");
  const rootLayoutPath = join(process.cwd(), "app", "layout.tsx");

  const isPageExists = await Bun.file(pagePath).exists();
  const isrootLayoutExists = await Bun.file(rootLayoutPath).exists();

  if (!isPageExists) {
    console.log("current path", currentPath);
    throw new Error("we can't find page.tsx or page.jsx file in current route");
  }

  if (!isrootLayoutExists) {
    throw new Error("please define root layout in app dir");
  }

  try {
    const result = await Promise.all(
      [
        { path: pagePath, type: "page" as const },
        { path: rootLayoutPath, type: "layout" as const },
        { path: loadingFilePath, type: "loading" as const },
      ].map(async ({ path, type }) => {
        const result = await build({
          entrypoints: [path],
          outdir: ".rscInBun",
          plugins: [clientResolver],
        });
        if (result?.success) {
          const output = {
            type,
            path: result.outputs[0].path,
          };
          return output;
        }
      })
    );

    const output = await build({
      entrypoints: [...clientEntryPoints],
      format: "esm",
      outdir: resolve(process.cwd(), "build"),
    });

    const clientComponentMap: Record<any, any> = {};

    output?.outputs.forEach(async (file) => {
      // Parse file export names
      const [, exports] = parse(await file.text());
      let newContents = file.text;

      for (const exp of exports) {
        // Create a unique lookup key for each exported component.
        // Could be any identifier!
        // We'll choose the file path + export name for simplicity.
        const key = file.path + exp.n;
        clientComponentMap[key] = {
          // Have the browser import your component from your server
          // at `/build/[component].js`
          id: `/${relative(process.cwd(), file.path)}`,
          // Use the detected export name
          name: exp.n,
          // Turn off chunks. This is webpack-specific
          chunks: [],
          // Use an async import for the built resource in the browser
          async: true,
        };

        console.log(clientComponentMap);

        // Tag each component export with a special `react.client.reference` type
        // and the map key to look up import information.
        // This tells your stream renderer to avoid rendering the
        // client component server-side. Instead, import the built component
        // client-side at `clientComponentMap[key].id`
        newContents += `
${exp.ln}.$$id = ${JSON.stringify(key)};
${exp.ln}.$$typeof = Symbol.for("react.client.reference");
			`;
      }
      await writeFile(file.path, newContents);
    });

    const componetsAfterBuild = await Promise.all(
      result.map(async (page) => {
        if (!page) {
          const page = (await import("../.rscInBun/page")) as unknown as Module;
          return { default: page.default, type: "page" };
        }
        const componet = (await import(page.path)) as Module;
        return { default: componet.default, type: page.type };
      })
    );

    return {
      Page: componetsAfterBuild.find(({ type }) => type === "page")?.default!,
      Layout: componetsAfterBuild.find(({ type }) => type === "layout")
        ?.default!,
      searchParams,
      Loading: componetsAfterBuild.find(({ type }) => type === "loading")
        ?.default,
      clientComponentMap,
    };
  } catch (err) {
    throw err;
  }
}
