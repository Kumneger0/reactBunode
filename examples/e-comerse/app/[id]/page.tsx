import { type Products } from '../page';

export const getStaticPaths = async () => {
	const products = (await fetch('https://fakestoreapi.com/products').then((res) => res.json())) as
		| Array<Products>
		| undefined;
	return products?.map(({ id }) => ({ id }));
};

async function Page({ id }: { id: string }) {
	if (!id) return <div>invalid id</div>;
	const product = (await fetch(`https://fakestoreapi.com/products/${id}`).then((res) =>
		res.json()
	)) as Products | undefined;

	if (!product) return <div>invalid id</div>;

	return (
		<div className="w-full h-full flex items-center justify-center flex-col">
			<h1 className="text-center">{product.title}</h1>
			<div className="flex justify-center flex-wrap gap-5">
				<div>
					<img
						src={product.image}
						alt={product.title}
						className="object-contain max-w-[400px] aspect-[3/4] w-full h-auto rounded-lg mb-2"
					/>
				</div>

				<div className="flex flex-col gap-2 max-w-[300px]">
					<div>{product.category}</div>
					<div>{product.description}</div>
					<div>{product.price}</div>
					<button className="bg-green-600 p-3 border-none text-white rounded-lg">purchease</button>
				</div>
			</div>
		</div>
	);
}

export default Page;
