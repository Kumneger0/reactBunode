import { type Products } from '../page';

export const getProduct = async (id: string) => {
	return (await fetch(`https://fakestoreapi.com/products/${id}`).then((res) => res.json())) as
		| Products
		| undefined;
};

export const getStaticPaths = async () => {
	const products = (await fetch('https://fakestoreapi.com/products').then((res) => res.json())) as
		| Array<Products>
		| undefined;
	return products?.map(({ id }) => ({ id }));
};

export const generateMetadata = async ({ id }: { id: string }) => {
	const product = await getProduct(id);

	return {
		title: product?.title,
		description: product?.description,
		openGraph: {
			images: [{ url: product?.image }]
		}
	};
};

async function Page({ id }: { id: string }) {
	if (!id) return <div>invalid id</div>;
	const product = await getProduct(id);

	if (!product) return <div>invalid id</div>;

	return (
		<div className="flex flex-col items-center h-full justify-center">
			<h1 className="text-center my-10 font-bold text-2xl">{product.title}</h1>
			<div className="flex flex-col md:flex-row gap-5">
				<div className="w-full md:w-1/2">
					<img
						src={product.image}
						alt={product.title}
						className="object-contain max-w-[400px] h-auto rounded-lg mb-2"
					/>
				</div>
				<div className="w-full md:w-1/2">
					<div className="flex flex-col gap-2">
						<div className="text-center md:text-left font-bold text-lg">{product.category}</div>
						<div className="text-center md:text-left">{product.description}</div>
						<div className="text-center md:text-left font-bold text-lg">
							${product.price}/
							<span className="line-through">${Math.trunc(Number(product?.price) * 1.3)}</span>{' '}
						</div>
						<div className="flex justify-center">
							<a href={`/thankyou/${id}`}>
								<button className="bg-green-600 p-3 border-none text-white rounded-lg">
									Purchase
								</button>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Page;
