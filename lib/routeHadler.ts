import { existsSync, readdirSync } from "fs";
import { parse } from "es-module-lexer";
import { writeFile } from "fs/promises";
import type { HonoRequest } from "hono";
import { relative } from "node:path";
import { resolve as nodeResolve } from "path";
import React, { type FC } from "react";
import packageJson from "../package.json";
import { clientResolver } from "../plugins/client-component-resolver";
import { build } from "./buildPages";
import { statSync } from "fs";
import { join } from "path";
export const clientEntryPoints = new Set<string>();

function getExternalsFromPackageJson(): string[] {
  const sections: (keyof typeof packageJson)[] = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
  ];
  const externals: string[] = [];

  for (const section of sections) {
    if (packageJson[section]) {
      externals.push(...Object.keys(packageJson[section]));
    }
  }

  return Array.from(new Set(externals));
}

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

  if (!dynamicRouteStatus.isDynamic) {
    return Error("not found", { cause: currentPath });
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
            external: getExternalsFromPackageJson(),
            format: "esm",
            bundle: true,
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
      splitting: true,
    });

    bunResult?.outputFiles?.forEach(async (file) => {
      const [, exports] = parse(file.text);
      let newContents = file.text;

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
