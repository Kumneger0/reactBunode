import React from 'react';

export type Products = {
	id: number;
	title: string;
	price: string;
	category: string;
	description: string;
	image: string;
};

async function Page() {
	const products = (await fetch('https://fakestoreapi.com/products').then((res) => res.json())) as
		| Array<Products>
		| undefined;
	return (
		<>
			<h1 className="w-full text-center">DEMO E-commerse application</h1>
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
		<p className="text-xl font-bold mb-2">${price}</p>
		<a href={`/${id}`} className="text-white">
			Detail
		</a>
	</div>
);
