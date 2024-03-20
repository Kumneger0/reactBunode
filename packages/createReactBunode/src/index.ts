#!/usr/bin/env bun

import prog from 'caporal';
import prompt, { type Schema } from 'prompt';
import fs from 'fs-extra';
import { $, file } from 'bun';
import { files } from './projectFiles';

createNewApplication();
export async function createNewApplication() {
	const schema: Schema = {
		properties: {
			folderName: {},
			typeScript: {
				description: 'do you wanna use typescript ? Y | N',
				enum: ['Y', 'N', 'y', 'n']
			},
			installdependencies: {
				description: 'do wanna intall dependencies ? Y | N',
				enum: ['Y', 'N', 'y', 'n']
			}
		}
	};

	const reactBunodeVersion = await fetch('https://registry.npmjs.org/reactbunode')
		.then(async (res) => await res.json())
		.then((data) => data as { 'dist-tags': { latest: string } })
		.catch(console.error);

	const version = reactBunodeVersion ? reactBunodeVersion['dist-tags']['latest'] : '0.0.13';

	const packageJSON = {
		name: 'e-comerse',
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
			reactbunode: version,
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
		'reactbunode.config.ts': files['reactBunodeConfig'],
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
		'reactbunode.config.js': files['reactBunodeConfigJS'],
		'app/page.jsx': files['homePageJS'],
		'app/layout.jsx': files['rootLayouFileJS'],
		'app/[id]/page.jsx': files['idRouteJS'],
		'app/thankyou/[id]/page.jsx': files['thankYouPagejs'],
		'app/global.css': files['globalCss']
	};

	prog.version('0.0.6').action((args, options, logger) => {
		prompt.start();
		prompt.get(schema, function (err, result) {
			if (err) {
				logger.error('Error reading input:', err);
				return;
			}

			const projectDir = result.folderName as string;
			const isTypeScript = (result.typeScript as string).toLowerCase() == 'y';
			const shoudlInstallDependencies = (result.installdependencies as string).toLowerCase() == 'y';

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
				: projectStructureWithTypeScript;

			const promises = Object.keys(projectStructure).map((file) => {
				const content = projectStructure[file as keyof typeof projectStructure];
				const filePath = `${projectDir}/${file}`;
				return fs.outputFile(filePath, content);
			});

			Promise.all(promises)
				.then(async () => {
					if (shoudlInstallDependencies) {
						console.log('intalling dependencies');
						await $`cd ${projectDir}; bun install`;
						console.log('installation done');
						console.log(`cd ${projectDir}`);
						console.log(`bun run dev`);
						return;
					}
					console.log(`cd ${projectDir} \n`);
					console.log('bun install');
					console.log('bun run dev');
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
}
