#!/usr/bin/env bun

import prog from 'caporal';
import prompt, { type Schema } from 'prompt';
import fs from 'fs-extra';
import { $ } from 'bun';
import { files } from './projectFiles';

const reactBunodeConfig = `
import { join } from 'path';
import { type ReactBunodeConfig } from 'reactbunode/config';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const Config: ReactBunodeConfig = {
	style: {
		postcss: {
			plugins: [tailwind as any, autoprefixer]
		}
	}
};

export default Config;`;

const schema: Schema = {
	properties: {
		folderName: {},
		typeScript: {
			description: 'do you wanna use typescript ? Y | N',
			enum: ['Y', 'N', 'y', 'n']
		}
	}
};

const packageJSON = {
	name: 'e-comerse',
	module: 'app/page.tsx',
	type: 'module',
	devDependencies: {
		'@types/bun': 'latest'
	},
	scripts: {
		dev: 'reactBunode dev',
		build: 'reactBunode build',
		start: 'reactBunode start'
	},
	dependencies: {
		reactbunode: '0.0.11',
		react: '18.3.0-next-3706edb81-20230308',
		'react-dom': '18.3.0-next-3706edb81-20230308',
		autoprefixer: '10.4.18',
		tailwindcss: '3.4.1'
	},
	peerDependencies: {
		typescript: '^5.0.0'
	}
};

const projectStructureWithTypeScript = {
	'package.json': JSON.stringify(packageJSON, null, 2),
	'tailwind.config.js': files['tailwindConfig'],
	'reactbunode.config.ts': reactBunodeConfig,
	'app/page.tsx': files['homePage'],
	'app/layout.tsx': files['rootLayouFile'],
	'app/[id]/page.tsx': files['idRoute'],
	'app/thankyou/[id]/page.tsx': files['thankYouPage'],
	'app/global.css': files['globalCss'],
	'tsconfig.json': files['tsconfig']
};

const projectStructureWithoutTypeScript = {
	'package.json': JSON.stringify(packageJSON, null, 2),
	'tailwind.config.js': files['tailwindConfig'],
	'reactbunode.config.js': reactBunodeConfig,
	'app/page.jsx': files['homePageJS'],
	'app/layout.jsx': files['rootLayouFileJS'],
	'app/[id]/page.jsx': files['idRouteJS'],
	'app/thankyou/[id]/page.jsx': files['thankYouPagejs'],
	'app/global.css': files['globalCss']
};

prog.version('1.0.0').action((args, options, logger) => {
	prompt.start();
	prompt.get(schema, function (err, result) {
		if (err) {
			logger.error('Error reading input:', err);
			return;
		}

		const projectDir = result.folderName as string;
		const isTypeScript = (result.typeScript as string).toLowerCase() == 'y';

		$`mkdir ${projectDir}`;

		const appDir = `${projectDir}/app`;
		createDir(appDir);
		const dynamicRoute = `${appDir}/[id]`;
		createDir(dynamicRoute);
		const thankYouRoute = `${appDir}/thankyou`;
		createDir(thankYouRoute);
		const thakyouRouteId = `${thankYouRoute}/[id]`;
		createDir(thakyouRouteId);

		const projectStructure = isTypeScript
			? projectStructureWithTypeScript
			: projectStructureWithoutTypeScript;

		const promises = Object.keys(projectStructure).map((file) => {
			const content = projectStructure[file as keyof typeof projectStructure];
			const filePath = `${projectDir}/${file}`;
			return fs.outputFile(filePath, content);
		});

		Promise.all(promises)
			.then(async () => {
				console.log('intallinde depencies');
				await $`cd ${projectDir}; bun run build; bun run start`;
				console.log('installation done');
			})
			.catch((err) => {
				logger.error('Error creating files:', err);
			});
	});
});

function createDir(dirName: string) {
	$`mkdir ${dirName}`;
}

prog.parse(process.argv);
