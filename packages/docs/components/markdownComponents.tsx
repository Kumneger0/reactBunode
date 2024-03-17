import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark as theme } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export function Heading({ children }: { children?: React.ReactNode }) {
	return <h1 className="font-bold text-2xl py-2 my-2">{children}</h1>;
}
export function Heading2({ children }: { children?: React.ReactNode }) {
	return <h2 className="font-bold text-xl py-2 my-2">{children}</h2>;
}

export function Li({ children }: { children?: React.ReactNode }) {
	return <li className=" py-1">{children}</li>;
}

export function Heading3({ children }: { children?: React.ReactNode }) {
	return <h3 className="font-bold text-lg">{children}</h3>;
}

export function A({ children, href }: { children?: React.ReactNode; href?: string }) {
	return (
		<a href={href} className="text-blue-400 underline">
			{children}
		</a>
	);
}

export function Code({ children }: { children: string }) {
	return (
		<code>
			<SyntaxHighlighter language="javascript" style={theme}>
				{children}
			</SyntaxHighlighter>
		</code>
	);
}
