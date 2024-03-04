
export async function POST({ request, cookies }) {
	const data = await request.json();

	// Set cookies or session data. For simplicity, we'll use cookies here.
	cookies.set('user', JSON.stringify(data.user), {
		path: '/',
		httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript, enhancing security
		secure: true, // Ensures the cookie is sent over HTTPS
		sameSite: 'Strict', // Additional security for cookie transmission
	});

	cookies.set('token', JSON.stringify(data.token), {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'Strict',
	});

	return new Response(
		JSON.stringify({ 'status': true, 'message': 'Session set!' }),
		{
			headers: { 'content-type': 'application/json' }
		}
	)
}