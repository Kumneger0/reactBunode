import { parse } from "es-module-lexer";
import { writeFile } from "fs/promises";
import type { HonoRequest } from "hono";
import { relative } from "node:path";
import { resolve as nodeResolve } from "path";
import React, { type FC } from "react";
import packageJson from "../package.json";
import { clientResolver } from "../plugins/client-component-resolver";
import { build } from "./_buildCurrentRoute";

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

  // Removing potential duplicates between dev and peer
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

  const clientComponentMap: Record<any, any> = {};

  const componets = [
    { path: pagePath, type: "page" as const },
    { path: rootLayoutPath, type: "layout" as const },
    { path: loadingFilePath, type: "loading" as const },
  ];

  try {
    const result = await Promise.all(
      componets.map(async ({ path, type }) => {
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

    console.log(clientEntryPoints);

    const bunResult = await build({
      entryPoints: [...clientEntryPoints],
      format: "esm",
      outdir: nodeResolve(process.cwd(), "build"),
      bundle: true,
      write: false,
      splitting: true,
    });

    console.log("bun result", bunResult);

    bunResult?.outputFiles?.forEach(async (file) => {
      const [, exports] = parse(file.text);
      let newContents = file.text;

      console.log(exports);

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
      componets.map(async (page) => {
        // if (!page) return;
        const componet = (await import(
          join(process.cwd(), "build", `${page.type}.js`)
        )) as Module;
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
