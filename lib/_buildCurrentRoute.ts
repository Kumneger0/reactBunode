import { clientResolverEsBuild } from "./../plugins/client-component-resolver";
import type { BuildConfig } from "bun";
import esbuild, { type BuildOptions } from "esbuild";

// export async function build(config: BuildConfig) {
//   try {
//     const result = await Bun.build(config);
//     return result;
//   } catch (err) {}
// }

export async function bundleWithEsBuild(buildOptions: BuildOptions) {
  try {
    const result = await esbuild.build({
      plugins: [clientResolverEsBuild],
      ...buildOptions,
    });
    return result;
  } catch (err) {
    console.error(err);
  }
}

export { bundleWithEsBuild as build };
