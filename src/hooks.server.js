/** @type {import('@sveltejs/kit').Handle} */
import { redirect } from '@sveltejs/kit';
export async function handle({ event, resolve }) {
	// Safely attempt to parse the cookies, defaulting to null if not found or parse fails
	let token = null;
	let user = null;

	console.log(event.url.pathname);
	try {
		token = event.cookies.get('token') ? JSON.parse(event.cookies.get('token')) : null;
		user = event.cookies.get('user') ? JSON.parse(event.cookies.get('user')) : null;
	} catch (error) {
		console.error('Error parsing cookies', error);
	}

	// Your VIP list: Protected links that should not be redirected
	const publicLinks = ['/api/authenticate','/login'];

	// Example condition: if you want to delete cookies under certain conditions
	if (event.url.pathname.endsWith('logout')) {
		event.cookies.delete('token',{
			path: '/',
			httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript, enhancing security
			secure: true, // Ensures the cookie is sent over HTTPS
			sameSite: 'Strict', // Additional security for cookie transmission
		});
		event.cookies.delete('user',{
			path: '/',
			httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript, enhancing security
			secure: true, // Ensures the cookie is sent over HTTPS
			sameSite: 'Strict', // Additional security for cookie transmission
		});
		throw redirect(303, '/login');
	}

	// Check if both token and user are not set
	if (!token && !user) {
		if (!publicLinks.includes(event.url.pathname)) {
			console.log(event.url.pathname);
			// Not on the list? That's a no-entry. Redirect to login.
			return redirect(303, '/login');
		}

	}
	return resolve(event);
}