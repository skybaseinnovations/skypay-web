import { apiKey } from '../checkout-stores';
import { CheckoutApi } from '../utils/CheckoutApi';

export class CheckoutRepo {
	apiKey: string | null;

	constructor(apiKey: string | null) {
		this.apiKey = apiKey;
	}

	async providers(success: (data: any) => void, failed: (message: string) => void) {
		try {

			const response = await fetch(`${CheckoutApi.PAYMENT_PROVIDERS}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Key': this.apiKey 
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

	async payment(id: string, success: (data: any) => void, failed: (message: string) => void) {
		try {
			const response = await fetch(`${CheckoutApi.PAYMENTS}/${id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Key': this.apiKey 
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
					'Key': this.apiKey 
				},
				body: JSON.stringify(payload)
			});

			const data = await response.json();

			if (data.status) {
				success(data.data)
			} else {
				failed(data.message || 'Something went wrong', data.errors); // You might want to adjust based on your API's error handling
			}
		} catch (error: any) {
			failed(error.message, {}); // Invoke the failed callback with the error message
		}
	}

	async update(id: string, payload: any, success: (data: any) => void, failed: (message: string, errors: {}) => void) {
		try {
			const response = await fetch(`${CheckoutApi.PAYMENTS}/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Key': this.apiKey 
				},
				body: JSON.stringify(payload)
			});

			const data = await response.json();

			if (data.status) {
				success(data.data)
			} else {
				failed(data.message || 'Something went wrong', data.errors); // You might want to adjust based on your API's error handling
			}
		} catch (error: any) {
			failed(error.message, {}); // Invoke the failed callback with the error message
		}
	}

	async process(payload: any): Promise<any> {
		try {
		  console.log(payload);
		  const response = await fetch(`${CheckoutApi.VERIFY}`, {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept': 'application/json',
			},
			body: JSON.stringify(payload)
		  });
	
		  const data = await response.json();
	
		  if (data.status) {
			return data.data; // Resolve the promise with data on success
		  } else {
			throw new Error(data.message || 'Something went wrong'); // Reject the promise with an error message on failure
		  }
		} catch (error: any) {
		  console.error('Fetch error:', error.message);
		  throw error; // Rethrow or create a new Error instance to reject the promise
		}
	  }
}
