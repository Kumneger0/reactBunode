import React from 'react';
import Markdown from 'react-markdown';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { gruvboxDark as theme } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const metadata = {
	title: 'React Bunode docmentaion application',
	description: 'This is a demo e-commerse application built with ReactBunny',
	keywords: 'demo, e-commerse, application, reactbunny',
	openGraph: {
		images: []
	}
};

async function Page() {
	return (
		<>
			<div className="flex relative flex-wrap justify-center gap-5">
				<div className="w-[20%]  gap-2 top-[80px] max-h-[600px] sticky bg-gray-800 text-white p-6 rounded-lg shadow-lg">
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
							href="#Setting-up-new-Project"
						>
							Setting up new Project
						</a>
					</div>
					<div className="font-bold text-lg">
						<a className="text-white text-decoration-none hover:text-blue-500" href="#Pages">
							Pages
						</a>
					</div>
					<div className="font-bold text-lg">
						<a className="text-white text-decoration-none hover:text-blue-500" href="#Routes">
							Routes
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
								<h1 className="text-lg font-semibold">Important Note</h1> This library requires the
								Bun runtime to function. If you haven't already, you'll need to install Bun before
								you can use our SSG library.
							</div>
						</div>
					</div>
					<div id="Installation" className="p-4 my-3">
						<h1 className="font-bold text-xl">Installation</h1>
						<div>
							<p>
								After installing Bun, navigate to the directory where you want to create your new
								project and run the following command to initialize a new project:
							</p>

							<SyntaxHighlighter language="bash" style={theme}>
								bun init
							</SyntaxHighlighter>

							<p>This command will initialize new empty project </p>
							<p>
								Once your project is initialized, you can install our SSG library by running the
								following command:
							</p>

							<SyntaxHighlighter language="bash" style={theme}>
								bun add reactbunode
							</SyntaxHighlighter>
							<p>
								This command will add the <code>reactbunode</code> package to your project, making
								it available for use in your React applications.
							</p>
						</div>
					</div>
					<div id="Setting-up-new-Project" className="p-4 my-3">
						<SettingUpNewProject />
					</div>
					<div id="Pages" className="p-4 my-3">
						<h1 className="font-bold text-xl">Pages</h1>
						<div></div>
					</div>
					<div id="Routes" className="p-4 my-3">
						<h1 className="font-bold text-xl">Routes</h1>
						<div></div>
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

const SettingUpNewProject = () => {
	const markdown = `
export default function Layout({ children }) {
 return (
    <div>
      <header>
        {/* Header content */}
      </header>
      <main>
        {children}
      </main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
 );
}
`;

	return (
		<div className="p-4 my-3">
			<h1 className="font-bold text-xl">Setting up a New Project</h1>
			<div>
				<p>To set up a new project with our SSG library, follow these steps:</p>
				<br />

				<ol className="list-decimal list-inside">
					<li>
						First, create a new folder in your project directory and name it <code>app</code>. This
						folder will contain all the components and pages of your application.
					</li>
					<br />
					<li>
						Inside the <code>app</code> folder, create a new file named <code>layout.tsx</code> or{' '}
						<code>layout.jsx</code>. This file will serve as the layout wrapper for your entire
						application, similar to the layout file in Next.js.
					</li>
					<br />

					<li>
						<div>
							In the <code>layout.tsx</code> or <code>layout.jsx</code> file, export a React
							component that takes <code>children</code> as a prop and renders them on the page.
							This component will wrap all your application's pages, providing a consistent layout
							across your site.
						</div>

						<br />
						<p>
							Here's an example of what your <code>layout.tsx</code> or <code>layout.jsx</code> file
							might look like:
						</p>
						<SyntaxHighlighter language="jsx" style={theme}>
							{markdown}
						</SyntaxHighlighter>
					</li>
					<br />
					<li>
						Next Inside the <code>app</code> folder, create a another file named{' '}
						<code>page.tsx</code> or <code>page.jsx</code>
						from that file export default this is also similar Next.js.
					</li>
				</ol>
			</div>
		</div>
	);
};
