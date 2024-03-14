import type { BuildOptions } from 'esbuild';
import postCssPlugin from 'esbuild-style-plugin';
import { type AcceptedPlugin } from 'postcss';

export type ReactBunodeConfig = Partial<
	BuildOptions & {
		style: {
			postcss: {
				plugins: AcceptedPlugin[];
			};
		};
	}
>;
