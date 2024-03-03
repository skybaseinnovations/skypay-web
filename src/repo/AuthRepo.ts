import { Api } from '../utils/Api';
import { token, user } from '../stores';

export class AuthRepo {
	async login(email: string, password: string, success: (user: any) => void, failed: (message: string) => void) {
		try {

			const response = await fetch(Api.SIGNIN, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',},
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				failed("Something went wrong!");
			}
			const data = await response.json();

			if (data.status) {
				user.set(data.data.user);
				token.set(data.data.token);

				localStorage.setItem('user', JSON.stringify(data.data.user));
				localStorage.setItem('token', data.data.token);

				success(data.data.user)
			} else {
				failed(data.message || 'Something went wrong during login'); // You might want to adjust based on your API's error handling
			}
		} catch (error: any) {
			failed(error.message); // Invoke the failed callback with the error message
		}
	}
}
