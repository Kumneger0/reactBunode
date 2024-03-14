import { join } from 'path';
import { type ReactBunodeConfig } from 'reactbunode/config';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const Config: ReactBunodeConfig = {
	alias: {
		'@comp': join(process.cwd(), 'components')
	},
	style: {
		postcss: {
			plugins: [tailwind as any, autoprefixer]
		}
	}
};

export default Config;
