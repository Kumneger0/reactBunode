import { file, type BuildConfig } from "bun";
import fs from "node:fs/promises";
import { resolve, join } from "path";

async function build(config: BuildConfig) {
  try {
    const result = await Bun.build(config);
    return result;
  } catch (err) {
    err;
  }
}
const dir = resolve(process.cwd());

function getAppPath(baseDir: string) {
  return resolve(dir, baseDir);
}

async function handleBuild() {
  buildRoutes();
}

export async function buildRoutes(baseDir = "app") {
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
      watchFileChanges(eachfileAbsolutePath, destinationDir);
      build({
        entrypoints: [eachfileAbsolutePath],
        outdir: resolve(process.cwd(), "dist", destinationDir),
      });
    }
  });
}

async function watchFileChanges(filePath: string, destinationDir: string) {
  const { signal, abort } = new AbortController();

  const watcher = fs.watch(filePath, { signal });
  for await (const { eventType } of watcher) {
    if (eventType == "change") {
      ("---------------------------------------");
      `compiling ${filePath}`;

      await build({
        entrypoints: [filePath],
        minify: true,
        outdir: destinationDir,
      });
      ("done");
      ("-----------------------------------------");
    }
  }
}

export { handleBuild };
