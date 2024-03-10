export const metadata = {
	title: 'some title',
	description: 'some desciption'
};

const fakeData = new Array(15)
	.fill(
		'	Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto culpa provident aperiam corrupti mollitia numquam veritatis et soluta illo, quo eaque ex aliquid, iste labore nobis laudantium eligendi cupiditate temporibus quos odio dignissimos minima, blanditiis sunt. Ab quasi quidem atque.'
	)
	.map((value, i) => ({
		id: i,
		content: value
	}));

export const staticPaths = fakeData.map((_, id) => ({ id: id }));

export default function PageId({ id }: { id: (typeof fakeData)[number]['id'] }) {
	const requiedItem = fakeData.find((item) => Number(id) == item.id);
	if (!requiedItem) return <div>We are not able find item that you are lookig for</div>;
	return (
		<div className="text-white w-11/12 mx-auto max-w-6xl">
			<h1 className="text-4xl w-full text-center font-bold">
				Generate Static Sites With React and tailwind
			</h1>
			<div className="flex flex-wrap justify-center gap-5">
				<div>{requiedItem.id}</div>
				<div>{requiedItem.content}</div>
			</div>
		</div>
	);
}
