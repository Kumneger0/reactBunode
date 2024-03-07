// app/api/sayhello/route.ts
async function GET(request) {
	const data = await new Promise((res) =>
		setTimeout(() => res({ URL: request.url, method: 'GET' }), 3000)
	);
	return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
async function POST(request) {
	const data = await new Promise((res) =>
		setTimeout(() => res({ URL: request.url, method: 'post' }), 3000)
	);
	return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
async function PUT(request) {
	const data = await new Promise((res) =>
		setTimeout(() => res({ URL: request.url, method: 'put' }), 3000)
	);
	return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
async function DELETE(request) {
	const data = await new Promise((res) =>
		setTimeout(() => res({ URL: request.url, method: 'DELETE' }), 3000)
	);
	return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
export { PUT, POST, GET, DELETE };
