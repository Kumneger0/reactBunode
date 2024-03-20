import { A, Code, Heading, Heading2, Heading3, Li } from '@comp/markdownComponents';
import { MessageSquareWarning } from 'lucide-react';
import type { Metadata } from 'reactbunode/types';
import { join } from 'path';
import { type ComponentPropsWithoutRef } from 'react';

import Markdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark as theme } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const metadata: Metadata = {
	title: 'ReactBunode Documentation',
	openGraph: {
		images: []
	}
};

type MDXcomponents = NonNullable<ComponentPropsWithoutRef<typeof Markdown>['components']>;

const components: MDXcomponents = {
	h1: Heading,
	h2: Heading2,
	h3: Heading3,
	li: Li,
	a: A,
	code: Code as MDXcomponents['code']
};

const CustomList = () => {
	return (
		<ul className="p-0 m-0 relative">
			<li className="list-none border-l-2 border-white ml-4">
				<div className="pl-4 relative">Level 1</div>
			</li>
			<li className="list-none border-l-2 border-white ml-4">
				<div className="pl-4 relative">Level 1</div>
				<ul className="ml-4">
					<li className="list-none border-l-2 border-white ml-4">
						<div className="pl-4 relative">Level 2</div>
					</li>
					<li className="list-none border-l-2 border-white ml-4">
						<div className="pl-4 relative">Level 2</div>
						<ul className="ml-4">
							<li className="list-none border-l-2 border-white ml-4">
								<div className="pl-4 relative">Level 3</div>
							</li>
							<li className="list-none border-l-2 border-white ml-4">
								<div className="pl-4 relative">Level 3</div>
							</li>
						</ul>
					</li>
				</ul>
			</li>
			<li className="list-none border-l-2 border-white ml-4">
				<div className="pl-4 relative">Level 1</div>
			</li>
		</ul>
	);
};

async function Page() {
	return (
		<>
			<div className="flex relative flex-wrap justify-center gap-5">
				<div className="w-[20%]  gap-2 top-[80px] max-h-[600px] sticky  p-6 rounded-lg shadow-lg">
					<div className="font-bold text-lg">
						<a className="text-white text-decoration-none hover:text-blue-500" href="#get-started">
							Get Started
						</a>
					</div>
					<div className="font-bold text-lg">
						<a className="text-white text-decoration-none hover:text-blue-500" href="#Installation">
							Installation
						</a>
					</div>
					<div className="font-bold text-lg">
						<a
							className="text-white text-decoration-none hover:text-blue-500"
							href="#folder-structure"
						>
							Folder Structure
						</a>
					</div>

					<div className="font-bold text-lg">
						<a className="text-white text-decoration-none hover:text-blue-500" href="#Routes">
							Routing
						</a>
					</div>
					<div className="font-bold text-lg">
						<a className="text-white text-decoration-none hover:text-blue-500" href="#functions">
							Functions
						</a>
					</div>
					<div className="font-bold text-lg">
						<a
							className="text-white text-decoration-none hover:text-blue-500"
							href="#reactbunode.config"
						>
							reactbunode.config.ts
						</a>
					</div>
				</div>
				<div className="w-[65%]">
					<div id="get-started" className="p-4 my-3 leading-5">
						<h1 className="font-bold  text-xl">Get Started</h1>
						<div className="leading-7">
							ReactBunode is an experimental, lightweight static site generator library
							<div className="bg-orange-700 p-5 my-3 rounded-lg">
								<h1 className="text-lg font-semibold flex items-center gap-2">
									{' '}
									<MessageSquareWarning className="text-yellow-400" /> <div>Important Note</div>
								</h1>
								i am excited to share this project with you, but it's important to note that it's
								currently undergoing active development. While it might be functional for basic
								exploration and experimentation, it's not yet intended for use in real-world
								production applications.
							</div>
						</div>
					</div>
					<div id="Installation" className="p-4 my-3">
						<h1 className="font-bold text-xl">Installation</h1>
						<Installation />
					</div>
					<div id="folder-structure" className="p-4 my-3">
						{/*@ts-expect-error Type 'Promise<Element>' is not assignable to type 'ReactNode'.*/}
						<FolderStructure />
					</div>

					<div id="Routes" className="p-4 my-3">
						<h1 className="font-bold text-2xl py-2  my-2">Routes</h1>
						{/*@ts-expect-error Type 'Promise<Element>' is not assignable to type 'ReactNode'.*/}

						<Routing />
					</div>
					<div id="functions" className="p-4 my-3">
						<h1 className="font-bold text-2xl">functions</h1>
						{/*@ts-expect-error Type 'Promise<Element>' is not assignable to type 'ReactNode'.*/}

						<Functions />
					</div>
					<div id="#reactbunode.config" className="p-4 my-3">
						{/*@ts-expect-error Type 'Promise<Element>' is not assignable to type 'ReactNode'.*/}

						<ReactBunodeConfig />
					</div>
				</div>
			</div>
		</>
	);
}

export default Page;

function Installation() {
	const installationCommand = `bunx createReactBunode
`;
	return (
		<div className="">
			<div> To create a new ReactBunode project, use the following command:</div>
			<div>
				<SyntaxHighlighter language="bash" style={theme}>
					{installationCommand}
				</SyntaxHighlighter>
			</div>
			<div className="p-2 my-2">
				<span className="font-bold text-lg">Run the command: </span>
				Open a terminal in your desired project location and run the command .
			</div>
			<div className="p-2 my-2">
				<span className="font-bold text-lg">Follow prompts: </span>
				The command will guide you through additional setup steps, such as choosing a project name
				and configuration options
			</div>
			<div className="p-2 my-2">
				This will create a new project directory with the necessary files and configurations.
			</div>
		</div>
	);
}

async function FolderStructure() {
	const projectFolderStucture = await Bun.file(
		join(process.cwd(), 'docsInMDx', 'folderStructure.mdx')
	).text();
	console.log();
	return <RenderMarkdonw>{projectFolderStucture}</RenderMarkdonw>;
}

async function Routing() {
	const routing = await Bun.file(join(process.cwd(), 'docsInMDx', 'routing.mdx')).text();
	return (
		<div>
			<RenderMarkdonw>{routing}</RenderMarkdonw>
		</div>
	);
}

function RenderMarkdonw({ children }: { children: string }) {
	return (
		<Markdown components={components} className={''}>
			{children}
		</Markdown>
	);
}

async function Functions() {
	const generateMetadata = await Bun.file(
		join(process.cwd(), 'docsInMDx', 'generateMetadata.mdx')
	).text();
	const getStaticPaths = await Bun.file(
		join(process.cwd(), 'docsInMDx', 'getStaticPaths.mdx')
	).text();
	return (
		<div>
			<div>
				<RenderMarkdonw>{getStaticPaths}</RenderMarkdonw>
			</div>
			<div>
				<RenderMarkdonw>{generateMetadata}</RenderMarkdonw>
			</div>
		</div>
	);
}

async function ReactBunodeConfig() {
	const reactBunodeConfig = await Bun.file(
		join(process.cwd(), 'docsInMDx', 'reactbunodeconfig.mdx')
	).text();
	return (
		<div>
			<RenderMarkdonw>{reactBunodeConfig}</RenderMarkdonw>
		</div>
	);
}
