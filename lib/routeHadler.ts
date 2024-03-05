import { parse } from "es-module-lexer";
import { aliasPath } from "esbuild-plugin-alias-path";
import { existsSync, readdirSync, statSync } from "fs";
import { writeFile } from "fs/promises";
import type { HonoRequest } from "hono";
import { randomUUID } from "node:crypto";
import { relative } from "node:path";
import { join, resolve as nodeResolve } from "path";
import React, { type FC } from "react";
import { clientResolver } from "../plugins/client-component-resolver";
import { build } from "./buildPages";
export const clientEntryPoints = new Set<string>();

const alias = aliasPath({
  alias: {
    react: "./node_modules/react",
    "react-dom": "./node_modules/react-dom",
  },
});

console.log(alias);

interface BasePageProps {
  searchParams?: URL["searchParams"];
  children?: React.ReactNode;
}

type Module<T = {}> = {
  default: FC<T & BasePageProps>;
};

export async function routeHandler(req: HonoRequest) {
  const url = new URL(req.url);

  const searchParams = url.searchParams;

  const currentPath = join(process.cwd(), "app", url.pathname);

  console.log(currentPath);

  const isPathExists = existsSync(currentPath);
  const dynamicRouteRegEx = /\[[^\]\n]+\]$/gimsu;

  let dynamicRouteStatus: { isDynamic: boolean; path: string } & Record<
    string,
    any
  > = {
    isDynamic: false,
    path: "",
  };

  const splitedPathName = url.pathname.split("/").slice(0, -1).join("/");
  if (!isPathExists) {
    const pathsToCheckDynicRoute = join(process.cwd(), "app", splitedPathName);
    readdirSync(pathsToCheckDynicRoute).forEach(async (path) => {
      const isDir = statSync(join(pathsToCheckDynicRoute, path)).isDirectory();
      const isDynamic = isDir && dynamicRouteRegEx.test(path);
      if (isDynamic) {
        const removeSquereBrackets = path.replace("[", "").replace("]", "");
        dynamicRouteStatus = { isDynamic, path };
        dynamicRouteStatus.slug = removeSquereBrackets;
      }
    });
  }

  const componentPath = dynamicRouteStatus.isDynamic
    ? join(process.cwd(), "app", splitedPathName, dynamicRouteStatus.path)
    : currentPath;

  const pagePath = join(componentPath, "page.tsx");
  const loadingFilePath = join(componentPath, "loading.tsx");
  const rootLayoutPath = join(process.cwd(), "app", "layout.tsx");

  const isPageExists = await Bun.file(pagePath).exists();
  const isrootLayoutExists = await Bun.file(rootLayoutPath).exists();

  if (!isPageExists) {
    throw new Error("not found", { cause: pagePath });
  }

  if (!isrootLayoutExists) {
    throw new Error("please define root layout in app dir");
  }

  const clientComponentMap: Record<any, any> = {};

  const unfillteredPagePaths = [
    { path: pagePath, type: "page" as const },
    { path: rootLayoutPath, type: "layout" as const },
    { path: loadingFilePath, type: "loading" as const },
  ];

  const existsPromises = unfillteredPagePaths.map(async ({ path, type }) => {
    return { path, exists: await Bun.file(path).exists(), type };
  });

  const results = await Promise.all(existsPromises);

  const components = results.filter((result) => result.exists);

  try {
    const result = await Promise.all(
      components.map(async ({ path, type }) => {
        try {
          const result = await build({
            entryPoints: [path],
            outdir: join(process.cwd(), "build"),
            plugins: [clientResolver],
            packages: "external",
            format: "esm",
            bundle: true,
            jsxDev: true,
            jsx: "automatic",
          });

          const output = {
            type,
            path: join(process.cwd(), "build", `${type}.js`),
          };
          return output;
        } catch (err) {
          console.error(err);
        }
      })
    );

    const bunResult = await build({
      entryPoints: [...clientEntryPoints],
      format: "esm",
      outdir: nodeResolve(process.cwd(), "build"),
      bundle: true,
      write: false,
      jsxDev: true,
      jsx: "automatic",
    });

    console.log("client build stataus", bunResult);

    bunResult?.outputFiles?.forEach(async (file) => {
      const [, exports] = parse(file.text);
      let newContents = file.text;

      for (const exp of exports) {
        const key = file.path + exp.n;
        const uuid = randomUUID({ disableEntropyCache: true });
        clientComponentMap[uuid] = {
          id: `/${relative(process.cwd(), file.path)}`,
          name: exp.n,
          chunks: [],
          async: true,
        };

        newContents += `
          ${exp.ln}.$$id = ${JSON.stringify(uuid)};
          ${exp.ln}.$$typeof = Symbol.for("react.client.reference");
        `;
      }
      await writeFile(file.path, newContents);
    });

    const componetsAfterBuild = await Promise.all(
      components.map(async (page) => {
        // if (!page) return;
        const componet = (await import(
          join(process.cwd(), "build", `${page.type}.js`)
        )) as Module;
        return { default: componet.default, type: page.type };
      })
    );

    const props: Record<string, any> = { searchParams };

    props[dynamicRouteStatus?.slug as keyof typeof props] = decodeURIComponent(
      url.pathname.split("/").at(-1) as string
    );

    return {
      Page: componetsAfterBuild.find(({ type }) => type === "page")?.default!,
      Layout: componetsAfterBuild.find(({ type }) => type === "layout")
        ?.default!,
      props,
      Loading: componetsAfterBuild.find(({ type }) => type === "loading")
        ?.default,
      clientComponentMap,
    };
  } catch (err) {
    throw err;
  }
}
