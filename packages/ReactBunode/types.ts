export type Metadata = Partial<{
	title: string;
	description: string;
	keywords: string;
	openGraph: {
		images: {
			url: string;
		}[];
	};
}>;
