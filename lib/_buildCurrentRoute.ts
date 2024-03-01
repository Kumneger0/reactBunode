import type { BuildConfig } from "bun";
import { build as esbuild, type BuildOptions } from "esbuild";

// export async function build(config: BuildConfig) {
//   try {
//     const result = await Bun.build(config);
//     return result;
//   } catch (err) {
//     console.log(err);
//   }
// }
export async function build(config: BuildOptions) {
  try {
    const result = await esbuild(config);
    return result;
  } catch (err) {
    console.log(err);
  }
}
