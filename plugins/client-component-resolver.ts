import { relative, join } from "node:path";
import { resolve } from "path";
import { readFile } from "fs/promises";
import { type BunPlugin } from "bun";
import { clientEntryPoints } from "../lib/routeHadler";
const reactComponentRegex = /\.(tsx|jsx)$/;

import { type Plugin } from "esbuild";

export const clientResolver: BunPlugin = {
  name: "resolve-client-imports",
  target: "bun",

  setup(build) {
    build.onLoad({ filter: reactComponentRegex }, async ({ path, loader }) => {
      const contents = await readFile(path, "utf-8");

      if (contents.startsWith('"use client"')) {
        console.log(true, "use client", loader);
        build.config.external?.push(path);
        clientEntryPoints.add(path);

        return { contents, loader };
      }
      return { contents };
    });

    build.onResolve(
      { filter: reactComponentRegex },
      async ({ path: relativePath }) => {
        console.log("relative path", relativePath);

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

export const clientResolverEsBuild: Plugin = {
  name: "resolve-client-imports",

  setup(build) {
    build.onResolve(
      { filter: reactComponentRegex },
      async ({ path: relativePath }) => {
        console.log("relative path", relativePath, "es build");

        const path = resolve(relativePath);
        const contents = await readFile(path, "utf-8");
        console.log(
          join(
            process.cwd(),
            "build",
            `${relativePath?.split("/")?.at(-1)?.split(".")[0]}.js`
          )
        );
        if (
          contents.startsWith('"use client"') ||
          contents.startsWith("'use client'")
        ) {
          console.log("relative path", relativePath, "es build", "client");

          clientEntryPoints.add(path);

          return {
            external: true,
            path: join(
              "../",
              "build",
              `${relativePath?.split("/")?.at(-1)?.split(".")[0]}.js`
            ),
          };
        }
      }
    );
  },
};
