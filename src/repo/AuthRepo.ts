import { Api } from '../utils/Api';
import {  token, user } from '../stores';

export class AuthRepo {
	async login(email: string, password: string, success: (user: any) => void, failed: (message: string) => void) {
		try {

			const response = await fetch(Api.SIGNIN, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});
			const data = await response.json();

			if (data.status) {
				user.set(data.data.user);
				token.set(data.data.token);

				localStorage.setItem('user', JSON.stringify(data.data.user));
				localStorage.setItem('token', data.data.token);
				await this.authenticate(data.data.user, data.data.token)
				success(data.data.user);
			} else {
				failed(data.message || 'Something went wrong'); // You might want to adjust based on your API's error handling
			}
		} catch (error: any) {
			failed(error.message); // Invoke the failed callback with the error message
		}
	}

	async authenticate(user: any , token: any) {
		const response = await fetch('api/authenticate',{
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({
				'user': user,
				'token': token
			})
		});
		const data = await response.json();
		if(data.status){
			console.log(`BACK TO OK-->${JSON.stringify(data)}`);
		}
	}


	async signup(email: string, password: string, phone: string, name: string, business_type: string, business_name: string, success: (user: any) => void, failed: (message: string, errors: {}) => void) {
		try {

			const response = await fetch(Api.SIGNUP, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password, phone, name, business_name, business_type })
			});

			if (!response.ok) {
				failed('Something went wrong!', {});
			}
			const data = await response.json();

			if (data.status) {
				user.set(data.data.user);
				token.set(data.data.token);

				localStorage.setItem('user', JSON.stringify(data.data.user));
				localStorage.setItem('token', data.data.token);

				success(data.data.user);
			} else {
				failed(data.message || 'Something went wrong during signin', data.errors); // You might want to adjust based on your API's error handling
			}
		} catch (error: any) {
			failed(error.message, {}); // Invoke the failed callback with the error message
		}
	}

	async logout(success: () => void, failed: (message: string) => void) {
		try {

			localStorage.removeItem('user');
			localStorage.removeItem('token');
			user.set(null);
			token.set(null);
			success();
		} catch (error: any) {
			failed(error.message); // Invoke the failed callback with the error message
		}
	}
}
