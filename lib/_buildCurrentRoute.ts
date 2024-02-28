import type { BuildConfig } from "bun";
import esbuild, { type BuildOptions, type Plugin } from "esbuild";

export async function build(config: BuildConfig) {
  try {
    const result = await Bun.build(config);
    return result;
  } catch (err) {}
}

export async function bundleWithEsBuild(buildOptions: BuildOptions) {
  try {
    const result = await esbuild.build(buildOptions);

    return result;
  } catch (err) {}
}