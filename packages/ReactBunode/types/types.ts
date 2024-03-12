import type { FC } from 'react';

export interface BasePageProps {
	searchParams?: URL['searchParams'];
	children?: React.ReactNode;
}

export type Module<T = {}> = {
	default: FC<T & BasePageProps>;
};

export type Metadata = {
	title?: string | undefined;
	description?: string | undefined;
	author: string;
	openGraph?:
		| {
				images: {
					url: string;
				}[];
		  }
		| undefined;
} & Record<string, string>;

export type TJSDOM = { window: { document: Document }; serialize: () => string };
