import type { FC } from 'react';

export interface BasePageProps {
	searchParams?: URL['searchParams'];
	children?: React.ReactNode;
}

export type Module<T = {}> = {
	default: FC<T & BasePageProps>;
};
