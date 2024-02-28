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

const reactComponentRegex = /\.(tsx|jsx)$/;

const clientResolver: BunPlugin = {
  name: "resolve-client-imports",
  target: "bun",

  setup(build) {
    build.onLoad(
      { filter: reactComponentRegex, namespace: "file" },
      async (arg) => {
        console.log("onload", arg.path);
        const contents = await readFile(arg.path, "utf-8");
        console.log(contents.startsWith('"use client"'));
        if (contents.startsWith('"use client"')) {
          console.log("load working");
          build.config.external?.push(arg.path);
          return {
            contents: contents,
            loader: "tsx",
          };
        }
        return {
          contents,
        };
      }
    );

    build.onResolve(
      { filter: reactComponentRegex },
      async ({ path: relativePath }) => {
        console.log("on resolve is excuted", relativePath);

        const path = resolve(relativePath);
        const contents = await readFile(path, "utf-8");

        if (contents.startsWith('"use client"')) {
          clientEntryPoints.add(path);

          return {
            external: true,

            path: relativePath.replace(reactComponentRegex, ".js"),
          };
        }
      }
    );
  },
};

export async function routeHandler(req: HonoRequest) {
  const url = new URL(req.url);

  const searchParams = url.searchParams;
  const currentPath = join(process.cwd(), "app", url.pathname);

  currentPath;

  const pagePath = join(currentPath, "page.tsx");
  const loadingFilePath = join(currentPath, "loading.tsx");
  const rootLayoutPath = join(process.cwd(), "app", "layout.tsx");

  const isPageExists = await Bun.file(pagePath).exists();
  const isrootLayoutExists = await Bun.file(rootLayoutPath).exists();

  if (!isPageExists) {
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
        try {
          const result = await build({
            entrypoints: [path],
            outdir: join(process.cwd(), ".rscInBun"),
            plugins: [clientResolver],
          });

          console.log(result);

          const output = {
            type,
            path: join(process.cwd(), ".rscInBun", `${type}.js`),
          };
          return output;
        } catch (err) {
          err;
        }
      })
    );

    const output = await build({
      entrypoints: [...clientEntryPoints],
      format: "esm",
      outdir: resolve(process.cwd(), "build"),
    });

    const clientComponentMap: Record<any, any> = {};

    output?.outputs?.forEach(async (file) => {
      // Parse file export names
      const [, exports] = parse(await file.text());
      let newContents = await file.text();

      for (const exp of exports) {
        const key = file.path + exp.n;
        clientComponentMap[key] = {
          id: `/${relative(process.cwd(), file.path)}`,

          name: exp.n,
          chunks: [],
          async: true,
        };

        newContents += `
${exp.ln}.$$id = ${JSON.stringify(key)};
${exp.ln}.$$typeof = Symbol.for("react.client.reference");
			`;
      }
      await writeFile(file.path, newContents);
    });

    const componetsAfterBuild = await Promise.all(
      result.map(async (page) => {
        if (!page) return;
        const componet = (await import(page?.path)) as Module;
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
