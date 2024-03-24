import { AuthRepo } from './AuthRepo';
import { goto } from '$app/navigation';
import { Snackbarrgh } from '../utils/Snackbarrgh';

export class GenericRepo {
	async list(api: string, filter: string, success: (data: any) => void, failed: (message: string) => void) {
		try {
			const token = JSON.parse(localStorage.getItem('token')??'');
			const response = await fetch(api, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': `Bearer ${token.access_token}`,
				},
			});

			if (response.status === 401) {
				await new AuthRepo().logout(()=>{
					goto('/logout')
					return;
				}, (message)=>{
				})
				return;
			}

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

	async store(api: string, payload: any, success: (data: any) => void, failed: (message: string, errors: {}) => void) {
		try {
			const token = JSON.parse(localStorage.getItem('token')??'');
			const response = await fetch(api, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token.access_token}`,
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

	async storeForm(api: string, formData: any, success: (data: any) => void, failed: (message: string, errors: {}) => void) {
		try {
			const token = JSON.parse(localStorage.getItem('token')??'');
			const response = await fetch(api, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Authorization': `Bearer ${token.access_token}`,
				},
				body: formData
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


	async update(api: string, payload: any, success: (data: any) => void, failed: (message: string, errors: {}) => void) {
		try {
			const token = JSON.parse(localStorage.getItem('token')??'');
			const response = await fetch(api, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': `Bearer ${token.access_token}`,},
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

	async updateForm(api: string, formData: any, success: (data: any) => void, failed: (message: string, errors: {}) => void) {
		try {
			const token = JSON.parse(localStorage.getItem('token')??'');
			const response = await fetch(api, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Authorization': `Bearer ${token.access_token}`,},
				body: formData
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
