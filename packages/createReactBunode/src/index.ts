#!/usr/bin/env bun

import prog from 'caporal';
import prompt from 'prompt';
import fs from 'fs-extra';
import { $ } from 'bun';

const rootLayouFile = `
import React from 'react';

import './global.css';

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<head>
				<title>Demo E commerse application</title>
			</head>
			<body className="mx-auto text-white bg-gray-800 font-mono m-0 p-0 overflow-x-hidden">
				<div className="max-w-7xl mx-auto">{children}</div>
			</body>
		</html>
	);
}
export default Layout;
`;

const homePage = `
import React from 'react';

export type Products = {
	id: number;
	title: string;
	price: string;
	category: string;
	description: string;
	image: string;
};

export const metadata = {
	title: 'Demo E-commerse application',
	description: 'This is a demo e-commerse application built with ReactBunny',
	keywords: 'demo, e-commerse, application, reactbunny',
	openGraph: {
		images: [
			{
				url: '<image url>'
			}
		]
	}
};

async function Page() {
	const products = (await fetch('https://fakestoreapi.com/products').then((res) => res.json())) as
		| Array<Products>
		| undefined;
	return (
		<>
			<h1 className="w-full text-center font-bold text-3xl">DEMO E-commerse application</h1>
			<div className="flex flex-wrap justify-center gap-5">
				{products?.map((item, index) => <Card {...item} />)}
			</div>
		</>
	);
}

export default Page;

const Card = ({ title, id, image, price, description }: Products) => (
	<div className="w-full max-w-[300px] m-2 md:w-1/4 p-2 bg-gray-800 rounded-lg shadow-lg text-white">
		<h3 className="text-xl font-bold mb-2">{title}</h3>
		<img
			src={image}
			alt={title}
			className="object-contain aspect-[3/4] w-full h-auto rounded-lg mb-2"
		/>
		<p className="line-clamp-2 p-1 mb-2">{description}</p>
		<p className="text-xl font-bold mb-2">{price}</p>

		<a href={\`/\${id}\`} className="text-white">
			Detail
		</a>
	</div>
);

`;

const idRoutePage = `
import { type Products } from '../page';

export const getProduct = async (id: string) => {return (await fetch(\`https://fakestoreapi.com/products/\${id}\`).then((res) => res.json())) as
		| Products
		| undefined;
};


export const getStaticPaths = async () => {
	const products = (await fetch('https://fakestoreapi.com/products').then((res) => res.json())) as
		| Array<Products>
		| undefined;
	return products?.map(({ id }) => ({ id }));
}


export const generateMetadata = async ({ id }: { id: string }) => {
	const product = await getProduct(id);

	return {
		title: product?.title,
		description: product?.description,
		openGraph: {
			images: [{ url: product?.image }]
		}
	};
};



async function Page({ id }: { id: string }) {
	if (!id) return <div>invalid id</div>;
	const product = await getProduct(id);

	if (!product) return <div>invalid id</div>;

	return (
		<div className="w-full h-full flex items-center justify-center flex-col">
			<h1 className="text-center">{product.title}</h1>
			<div className="flex justify-center flex-wrap gap-5">
				<div>
					<img
						src={product.image}
						alt={product.title}
						className="object-contain max-w-[400px] aspect-[3/4] w-full h-auto rounded-lg mb-2"
					/>
				</div>

				<div className="flex flex-col gap-2 max-w-[300px]">
					<div>{product.category}</div>
					<div>{product.description}</div>
					<div>{product.price}</div>
					<a className="flex w-full justify-center" href={\`/thankyou/\${id}\`}>
						<button className="bg-green-600 p-3 border-none text-white rounded-lg">
							purchease
						</button>
					</a>
				</div>
			</div>
		</div>
	);
}

export default Page;

`;

const thankYouPage = `
import React from 'react';
import type { Products } from '../../page';
import { getProduct } from '../../[id]/page';

export const getStaticPaths = async () => {
	const products = (await fetch('https://fakestoreapi.com/products').then((res) => res.json())) as
		| Array<Products>
		| undefined;
	return products?.map(({ id }) => ({ id }));
};

export const generateMetadata = async ({ id }: { id: string }) => {
	const product = await getProduct(id);

	return {
		title: \`Purchase thank you page for \${product?.title}\`,
		description: product?.description
	};
};

async function ThankYouPage({ id }: { id: string }) {
	if (!id) return <div>invalid id</div>;
	const product = await getProduct(id);

	if (!product) return <div>invalid id</div>;
	return (
		<div className="w-full flex flex-col justify-center items-center">
			<h1 className="font-bold text-4xl"> Thank you for your purchase!</h1>
			<div>
				<img
					src={product.image}
					alt={product.title}
					className="object-contain max-w-[400px] aspect-[3/4] w-full h-auto rounded-lg mb-2"
				/>
			</div>
			<div>
				<a className="text-white font-bold text-3xl text-decoration-none" href="/">
					go back home
				</a>
			</div>
		</div>
	);
}

export default ThankYouPage;

`;

const globalCss = `
@tailwind base;
@tailwind components;
@tailwind utilities
`;

const tailwindConfig = `
 module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {}
	},
	plugins: []
};

`;

const tsconfig = `
{
    "compilerOptions": {
        "lib": [
            "ESNext",
            "DOM"
        ],
        "moduleDetection": "force",
        "allowJs": true,
        /* Bundler mode */
        "allowImportingTsExtensions": true,
        "verbatimModuleSyntax": true,
        /* Linting */
        "skipLibCheck": true,
        "noFallthroughCasesInSwitch": true,
        "forceConsistentCasingInFileNames": true,
        "checkJs": true,
        "module": "ESNext",
        "moduleResolution": "Node",
        "target": "ESNext",
        "jsx": "react-jsx",
        "noEmit": true,
        "strict": true,
        "noImplicitAny": true,
        "allowSyntheticDefaultImports": true,
        "resolveJsonModule": true,
        "paths": {
            "@comp/*": [
                "./components/*"
            ]
        }
    },
    "include": [
        "./"
    ],
    "exclude": [
        "node_modules"
    ]
}
`;

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

prog.version('1.0.0').action((args, options, logger) => {
	prompt.start();
	prompt.get(['folderName'], function (err, result) {
		if (err) {
			logger.error('Error reading input:', err);
			return;
		}

		const projectDir = result.folderName as string;

		$`mkdir ${projectDir}`;

		const appDir = `${projectDir}/app`;
		createDir(appDir);
		const dynamicRoute = `${appDir}/[id]`;
		createDir(dynamicRoute);
		const thankYouRoute = `${appDir}/thankyou`;
		createDir(thankYouRoute);
		const thakyouRouteId = `${thankYouRoute}/[id]`;
		createDir(thakyouRouteId);

		const projectStructure = {
			'package.json': JSON.stringify(
				{
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
				},
				null,
				2
			),
			'talwind.config.js': tailwindConfig,
			'reactbunode.config.ts': reactBunodeConfig,
			'app/page.tsx': homePage,
			'app/layout.tsx': rootLayouFile,
			'app/[id]/page.tsx': idRoutePage,
			'app/thankyou/[id]/page.tsx': thankYouPage,
			'app/global.css': globalCss,
			'tsconfig.json': tsconfig
		} as const;

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
