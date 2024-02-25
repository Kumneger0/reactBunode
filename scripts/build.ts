import { type BuildConfig } from "bun";
import fs from "node:fs/promises";
import { resolve } from "path";

async function build(config: BuildConfig) {
  try {
    const result = await Bun.build(config);
    return result;
  } catch (err) {
    console.log(err);
  }
}
const dir = resolve(process.cwd(), "app");

const buildDir = resolve(process.cwd(), "build");

function getAppPath(...path: string[]) {
  return resolve(dir, ...path);
}

function getBuildPath(...pathToAppend: string[]) {
  return resolve(buildDir, ...pathToAppend);
}

async function handleBuild() {
  const files = await fs.readdir(getAppPath());

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

const buildPaths: string[] = [];

async function buildRoutes(path: string = "", level = 0) {
  path !== "" ? buildPaths.push(path) : [];

  const currentAppPath = getAppPath(...buildPaths);
  const fileOrDirNames = await fs.readdir(currentAppPath);

  console.log(fileOrDirNames);

  fileOrDirNames.forEach(async (fileOrDirName) => {
    console.log(resolve(currentAppPath, fileOrDirName));
    const stat = await fs.stat(resolve(currentAppPath, fileOrDirName));

    console.log(stat);

    if (stat.isDirectory()) {
      buildRoutes(fileOrDirName, level + 1);
    }
    if (stat.isFile()) {
      handleFileBuild(
        resolve(currentAppPath, fileOrDirName),
        getBuildPath(...buildPaths)
      );
    }
  });
}

async function handleFileBuild(filePath: string, buildDir: string) {
  const stat = await fs.stat(filePath);
  if (stat.isFile()) {
    const initilaBuildResult = await build({
      entrypoints: [filePath],
      minify: true,
      outdir: buildDir,
    });
    console.log(
      initilaBuildResult?.success
        ? `done ${filePath}`
        : "filaed for some resone"
    );
  }
}

const result = await build({
  entrypoints: [resolve(process.cwd(), "app/about/page")],
  outdir: resolve(process.cwd(), "build/about"),
});

console.log(result);

function watchFileChanges() {}

export { handleBuild };
