import { relative, join } from "node:path";
import { resolve } from "path";
import { readFile } from "fs/promises";
import { type BunPlugin } from "bun";
import { clientEntryPoints } from "../lib/routeHadler";
const reactComponentRegex = /\.(tsx|jsx)$/;

import { type Plugin } from "esbuild";

export const clientResolver: BunPlugin = {
  name: "resolve-client-imports",

  setup(build) {
    build.onResolve(
      { filter: reactComponentRegex },
      async ({ path: relativePath }) => {
        console.log("relative path", relativePath);

        const path = join(
          process.cwd(),
          "app",
          `${relativePath?.split("/")?.at(-1)?.split(".")[0]}.tsx`
        );

        const contents = await readFile(path, "utf-8");

        if (
          contents.startsWith('"use client"') ||
          contents.startsWith("'use client'")
        ) {
          console.log(relativePath.replace(reactComponentRegex, ".js"));
          clientEntryPoints.add(path);

          return {
            external: true,
            path: "we fuked up",
          };
        }
      }
    );
  },
};
