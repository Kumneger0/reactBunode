// import resolve from "@rollup/plugin-node-resolve";

import { resolve } from "path";

import { join } from "path";

import { build as esbuild } from "esbuild";

import { readFile } from "fs/promises";

const clientEntryPoints = new Set();

// build();

// async function build() {
//   const result = await rollup({
//     input: "./src/clientEntry.ts",
//     plugins: [typescript(), resolve()],
//   });

//   const outpult = await result.write({
//     format: "esm",
//     minifyInternalExports: true,
//     dir: join(process.cwd(), "build"),
//     compact: true,
//   });

//   console.log(outpult);
// }

const reactComponentRegex = /\.(tsx|jsx)$/;

Bun.build({
  entryPoints: ["./app/page.tsx"],
  bundle: true,
  format: "esm",
  minify: true,
  outdir: "nodebuild",

  plugins: [
    {
      name: "client import resolver",
      setup(build) {
        build.onResolve(
          { filter: reactComponentRegex },
          async ({ path: relativePath }) => {
            const path = `${
              relativePath?.split("/")?.at(-1)?.split(".")[0]
            }.tsx`;

            console.log("relative path", path, "es build");

            const contents = await readFile(
              join(process.cwd(), "app", path),
              "utf-8"
            );
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
              console.log(
                "relativefkajlkfjaslfj",
                relativePath,
                "es build",
                "client"
              );

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
    },
  ],
});
