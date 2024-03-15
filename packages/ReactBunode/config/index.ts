import type { BuildOptions } from 'esbuild';
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
