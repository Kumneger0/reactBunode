import type { BuildConfig } from "bun";

export async function build(config: BuildConfig) {
  try {
    const result = await Bun.build(config);
    return result;
  } catch (err) {
    console.log(err);
  }
}
