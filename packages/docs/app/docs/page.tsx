import React, { type ComponentPropsWithoutRef } from 'react';

import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gruvboxDark as theme } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const metadata = {
	title: 'React Bunode docmentaion application',
	description: 'This is a demo e-commerse application built with ReactBunode',
	keywords: 'demo, e-commerse, application, ReactBunode',
	openGraph: {
		images: []
	}
};

const projectFolderStucture = `
# Folder Structure

The project directory has the following structure:

* **package.json:** Contains project metadata like dependencies, scripts, and configurations.
* **tailwind.config.js (optional):** Defines Tailwind CSS configuration (if using Tailwind).
* **reactbunode.config.ts:** Holds ReactBunode-specific configurations.
* **tsconfig.json:** Contains TypeScript configuration settings.
* **app/**: The core application directory:
* **app/page.tsx:** The main entry point for the home page.
* **app/layout.tsx:** The root layout component, similar to Next.js's layout approach.
* **app/[id]/page.tsx:** Pages with dynamic routing based on IDs.
* **app/thankyou/[id]/page.tsx:** Thank you pages with dynamic routing based on IDs.
* **app/global.css:** Defines global CSS styles for the application.
   (Optional sections for assets, API, components, etc.)

`;

const routing = `

ReactBunode utilizes a convenient file-based routing system to manage navigation within your application. This section delves into creating both standard and dynamic routes.

## Creating a Route

To create a route, follow these steps:

1. **Create a folder:** Inside the \`app\` directory, create a new folder. The name of this folder will correspond to the URL path your route will represent (e.g., \`about\` for \`/about\`).
2. **Add \`page.tsx\`:** Renders content for the /about route.


## Dynamic Routes

ReactBunode supports dynamic routes, allowing you to capture variable parts of the URL path. Here's how to create and access them:

1. **Use square brackets:**  Enclose a segment of the folder name within square brackets (for eg \`[id]\`)
2. **Access dynamic value:** In the \`page.tsx\` file, you can access the dynamic value using a prop for eg id if your folder name is [id]
### Example`;

const dynamicRouteExample = `
const MyDynamicPage = ({ id }) => {
return (
    <div>
      <h1>This is a dynamic page!</h1>
      <p>The slug is: {id}</p>
    </div>
  );
};

export default MyDynamicPage;
`;

function Heading({ children }: { children?: React.ReactNode }) {
	return <h1 className="font-bold text-2xl py-2 my-2">{children}</h1>;
}
function Heading2({ children }: { children?: React.ReactNode }) {
	return <h2 className="font-bold text-xl py-2 my-2">{children}</h2>;
}

function Li({ children }: { children?: React.ReactNode }) {
	return <li className=" py-1">{children}</li>;
}

function Heading3({ children }: { children?: React.ReactNode }) {
	return <h3 className="font-bold text-lg">{children}</h3>;
}

type MDXcomponents = NonNullable<ComponentPropsWithoutRef<typeof Markdown>['components']>;

const components: MDXcomponents = {
	h1: Heading,
	h2: Heading2,
	h3: Heading3,
	li: Li
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
						<a className="text-white text-decoration-none hover:text-blue-500" href="#Metadata">
							Metadata
						</a>
					</div>
				</div>
				<div className="w-[65%]">
					<div id="get-started" className="p-4 my-3 leading-5">
						<h1 className="font-bold  text-xl">Get Started</h1>
						<div className="leading-7">
							Welcome to the exciting world of static site generation (SSG) with our innovative
							library! This library empowers React developers to craft blazing-fast static HTML
							websites, offering a unique approach to building web experiences. It's currently under
							active development, and we'd love your feedback as you experiment with its
							capabilities.
							<div className="bg-orange-700 p-5 my-3 rounded-lg">
								<h1 className="text-lg font-semibold"> 😜 Important Note</h1>i am excited to share
								this project with you, but it's important to note that it's currently undergoing
								active development. While it might be functional for basic exploration and
								experimentation, it's not yet intended for use in real-world production
								applications.
							</div>
						</div>
					</div>
					<div id="Installation" className="p-4 my-3">
						<h1 className="font-bold text-xl">Installation</h1>
						<Installation />
					</div>
					<div id="folder-structure" className="p-4 my-3">
						<FolderStructure />
					</div>

					<div id="Routes" className="p-4 my-3">
						<h1 className="font-bold text-2xl py-2  my-2">Routes</h1>
						<Routing />
					</div>
					<div id="functions" className="p-4 my-3">
						<h1 className="font-bold text-xl">functions</h1>
						<div></div>
					</div>
					<div id="Metadata" className="p-4 my-3">
						<h1 className="font-bold text-xl">Metadata</h1>
						<div></div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Page;

function Installation() {
	const installationCommand = `    bunx createReactBunode
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

function FolderStructure() {
	return <RenderMarkdonw>{projectFolderStucture}</RenderMarkdonw>;
}

function Routing() {
	return (
		<div>
			<RenderMarkdonw>{routing}</RenderMarkdonw>
			<SyntaxHighlighter style={theme} language="javascript">
				{dynamicRouteExample}
			</SyntaxHighlighter>
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
