import { type BuildConfig } from "bun";
import fs from "node:fs/promises";
import { resolve, join } from "path";

async function build(config: BuildConfig) {
  try {
    const result = await Bun.build(config);
    return result;
  } catch (err) {
    console.log(err);
  }
}
const dir = resolve(process.cwd());

const buildDir = resolve(process.cwd());

function getAppPath(baseDir: string) {
  return resolve(dir, baseDir);
}

function getBuildPath() {
  return resolve(buildDir, "build");
}

async function handleBuild() {
  buildRoutes();
  return;
  const files = await fs.readdir(getAppPath("app"));

  console.log(files);

  files.forEach(async (file) => {
    const filePath = resolve(dir, file);
    const stat = await fs.stat(filePath);
    if (stat.isFile()) {
      const initilaBuildResult = await build({
        entrypoints: [filePath],
        minify: true,
        outdir: buildDir,
      });
      console.log(
        initilaBuildResult?.success
          ? `compiled ${filePath}`
          : "filaed for some resone"
      );
    }

    const { signal, abort } = new AbortController();

    try {
      const watcher = fs.watch(filePath, { signal });
      for await (const { eventType } of watcher) {
        if (eventType == "change") {
          console.log("---------------------------------------");
          console.log(`compiling ${filePath}`);

          await build({
            entrypoints: [filePath],
            minify: true,
            outdir: buildDir,
          });
          console.log("done");
          console.log("-----------------------------------------");
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      throw err;
    }
  });
}

const entrypointsMap = new Map();
async function buildRoutes(baseDir = "app") {
  const path = getAppPath(baseDir);
  const files = await fs.readdir(path);
  files.forEach(async (file) => {
    const eachfileAbsolutePath = resolve(path, file);
    const stat = await fs.stat(eachfileAbsolutePath);
    if (stat.isDirectory()) {
      return buildRoutes(join(baseDir, file));
    }
    if (stat.isFile()) {
      const destinationDir =
        baseDir == "app"
          ? ""
          : (() => {
              const arrofPath = baseDir.split("/").slice(1);
              return join(...arrofPath);
            })();
      build({
        entrypoints: [eachfileAbsolutePath],
        outdir: resolve(process.cwd(), "build", destinationDir),
      });
    }
  });
}

export { handleBuild };
