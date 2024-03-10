import React, { useEffect, useState } from 'react';
import Input from './input.tsx';
import Button from './button.tsx';

export const metadata = {
	title: 'this is string',
	descreption: 'this is descreption',
	author: 'kumneger wodimu',
	openGraph: {
		images: [
			{ url: `og image url` },
			{ url: `og image url` },
			{ url: `og image url` },
			{ url: `og image url` }
		]
	}
};

export const newArray = Array.from({ length: 15 }, (v, i) => ({
	content: `item ${i + 1}`,
	id: i + 1
}));

function Page() {
	return (
		<div className="text-white w-11/12 mx-auto max-w-6xl">
			<h1 className="text-4xl w-full text-center font-bold">
				Generate Static Sites With React and tailwind
			</h1>
			<div className="flex flex-wrap justify-center gap-5">
				{newArray.map((item, index) => (
					<Card id={item.id} key={index} title={item.content} />
				))}
			</div>
		</div>
	);
}

export default Page;

const Card = ({ title, id }) => (
	<div className="w-full max-w-[300px] m-2 md:w-1/4 p-4 bg-gray-800 rounded-lg shadow-lg text-white">
		<h3 className="text-xl font-bold mb-2">{title}</h3>
		<a href={`/${id}`}>
			<Button className="w-11/12 px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-greeen-400">
				click me
			</Button>
		</a>
	</div>
);
