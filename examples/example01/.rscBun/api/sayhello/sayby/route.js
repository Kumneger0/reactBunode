// app/api/sayhello/sayby/route.ts
async function GET(request) {
	const data = await new Promise((res) =>
		setTimeout(
			() =>
				res({
					URL: request.url,
					method: 'GET',
					message: 'say by endpoint called'
				}),
			3000
		)
	);
	return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
export { GET };
