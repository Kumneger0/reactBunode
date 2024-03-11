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
		title: `Purchase thank you page for ${product?.title}`,
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
