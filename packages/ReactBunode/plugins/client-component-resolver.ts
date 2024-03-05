import { readFile } from "fs/promises";
import { join } from "node:path";
import { clientEntryPoints } from "../lib/routeHadler";
const reactComponentRegex = /\.(tsx|jsx)$/;

import { type Plugin } from "esbuild";

export const clientResolver: Plugin = {
  name: "resolve-client-imports",

  setup(build) {
    build.onResolve({ filter: reactComponentRegex }, async (arg) => {
      console.log("relative path", arg);

      const filename = `${arg.path?.split("/")?.at(-1)?.split(".")[0]}`;

      const path = join(process.cwd(), "app", `${filename}.tsx`);

      const contents = await readFile(path, "utf-8");

      if (
        contents.startsWith('"use client"') ||
        contents.startsWith("'use client'")
      ) {
        console.log("client component", path);
        clientEntryPoints.add(path);

        return {
          external: true,
          path: `./${filename}.js`,
        };
      }
    });
  },
};