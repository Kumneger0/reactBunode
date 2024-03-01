import { relative, join } from "node:path";
import { resolve } from "path";
import { readFile } from "fs/promises";
import { file, type BunPlugin } from "bun";
import { clientEntryPoints } from "../lib/routeHadler";
const reactComponentRegex = /\.(tsx|jsx)$/;

import { type Plugin } from "esbuild";

export const clientResolver: Plugin = {
  name: "resolve-client-imports",

  setup(build) {
    build.onLoad({ filter: reactComponentRegex }, async (arg) => {
      console.log("relative path load", arg);

      const path = join(
        process.cwd(),
        "app",
        `${arg.path?.split("/")?.at(-1)?.split(".")[0]}.tsx`
      );

      const contents = await readFile(path, "utf-8");

      if (
        contents.startsWith('"use client"') ||
        contents.startsWith("'use client'")
      ) {
        return {
          contents: "",
        };
      }
    });

    build.onResolve({ filter: reactComponentRegex }, async (arg) => {
      console.log("relative path", arg);

      const filename = `${arg.path?.split("/")?.at(-1)?.split(".")[0]}`;

      const path = join(process.cwd(), "app", `${filename}.tsx`);

      console.log(path);

      const contents = await readFile(path, "utf-8");

      if (
        contents.startsWith('"use client"') ||
        contents.startsWith("'use client'")
      ) {
        console.log("client componet deteced");
        console.log(arg.path.replace(reactComponentRegex, ".js"));
        clientEntryPoints.add(path);

        return {
          external: true,
          path: `./${filename}.js`,
          namespace: "",
        };
      }
    });
  },
};
