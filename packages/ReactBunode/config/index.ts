import postCssPlugin from 'esbuild-style-plugin';
import { type AcceptedPlugin } from 'postcss';

type ReactBunodeConfig = {
	style: {
		postcss: {
			plugins: AcceptedPlugin[];
		};
	};
};

export function defineConfig(config: ReactBunodeConfig) {
	return postCssPlugin({
		postcss: config.style.postcss
	});
}
