import { CheckoutApi } from '../utils/CheckoutApi';

export class CheckoutRepo {
	async providers(apiKey: string, success: (data: any) => void, failed: (message: string) => void) {
		try {
			const response = await fetch(`${CheckoutApi.PAYMENT_PROVIDERS}/${apiKey}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
			});

			if (!response.ok) {
				failed("Something went wrong!");
			}
			const data = await response.json();

			if (data.status) {
				success(data.data)
			} else {
				failed(data.message || 'Something went wrong'); // You might want to adjust based on your API's error handling
			}
		} catch (error: any) {
			failed(error.message); // Invoke the failed callback with the error message
		}
	}

	async initiate(payload: any, success: (data: any) => void, failed: (message: string, errors: {}) => void) {
		try {
			const response = await fetch(CheckoutApi.INITIATE, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload)
			});

			const data = await response.json();

			if (data.status) {
				success(data.data)
			} else {
				failed(data.message || 'Something went wrong',data.errors); // You might want to adjust based on your API's error handling
			}
		} catch (error: any) {
			failed(error.message,{}); // Invoke the failed callback with the error message
		}
	}

	async update(id: string, payload: any, success: (data: any) => void, failed: (message: string, errors: {}) => void) {
		try {
			const response = await fetch(`${CheckoutApi.PAYMENTS}/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',},
				body: JSON.stringify(payload)
			});

			const data = await response.json();

			if (data.status) {
				success(data.data)
			} else {
				failed(data.message || 'Something went wrong',data.errors); // You might want to adjust based on your API's error handling
			}
		} catch (error: any) {
			failed(error.message,{}); // Invoke the failed callback with the error message
		}
	}
	async destroy(api: string, success: (message: string) => void, failed: (message: string) => void) {
		try {
			const token = JSON.parse(localStorage.getItem('token')??'');
			const response = await fetch(api, {
				method: 'DELETE',
				headers: {
					'Accept': 'application/json','Authorization': `Bearer ${token.access_token}`,},
			});
			const data = await response.json();

			if (data.status) {
				success(data.message || "Successfully deleted!")
			} else {
				failed(data.message || 'Something went wrong'); // You might want to adjust based on your API's error handling
			}
		} catch (error: any) {
			failed(error.message); // Invoke the failed callback with the error message
		}
	}
}
