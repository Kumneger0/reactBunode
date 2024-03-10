export function GET(request: Request) {
	console.log(request.method, 'request methode');
	return new Response('hello world');
}
