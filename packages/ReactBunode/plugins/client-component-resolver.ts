import { readFile } from 'fs/promises';
import { join } from 'node:path';
import { clientEntryPoints } from '../lib/routeHadler';
const reactComponentRegex = /\.(tsx|jsx)$/;

import { type Plugin } from 'esbuild';

export const clientResolver: Plugin = {
	name: 'resolve-client-imports',

	setup(build) {
		build.onResolve({ filter: reactComponentRegex }, async (arg) => {
			const filename = `${arg.path?.split('/')?.at(-1)?.split('.')[0]}`;
			console.log(filename);
			const path = join(process.cwd(), 'app', `${filename}.tsx`);

			const contents = await readFile(path, 'utf-8');

			if (contents.startsWith('"use client"') || contents.startsWith("'use client'")) {
				clientEntryPoints.add(path);
				console.log(filename, 'client resolved aftre removing');

				return {
					external: true,
					path: `./${filename}.js`
				};
			}
		});
	}
};
