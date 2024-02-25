import { type BuildConfig } from "bun";
import fs from "node:fs/promises";
import { resolve } from "path";

async function build(config: BuildConfig) {
  try {
    const result = await Bun.build(config);
  } catch (err) {
    console.log(err);
  }
}
const dir = resolve(process.cwd(), "app");
const buildDir = resolve(process.cwd(), "build");

const files = await fs.readdir(dir);

files.forEach(async (file) => {
  const filePath = resolve(dir, file);
  const stat = await fs.stat(filePath);
  if (stat.isFile()) {
    build({ entrypoints: [filePath], minify: true, outdir: buildDir });
  }

  const { signal, abort } = new AbortController();

  try {
    const watcher = fs.watch(filePath, { signal });
    for await (const event of watcher) {
      if (event.eventType == "change") {
        console.log("change detected on file rebuilding", event.filename);

        await build({
          entrypoints: [filePath],
          minify: true,
          outdir: buildDir,
        });
        console.log("done");
      }
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return;
    console.log(err);
    throw err;
  }
});

export { build };
