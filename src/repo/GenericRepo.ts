
export class GenericRepo {
	async list(api: string, filter: string, success: (data: any) => void, failed: (message: string) => void) {
		try {

			const response = await fetch(api, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',},
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

	async store(api: string, payload: any, success: (data: any) => void, failed: (message: string, errors: {}) => void) {
		try {

			const response = await fetch(api, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',},
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

	async update(api: string, payload: any, success: (data: any) => void, failed: (message: string, errors: {}) => void) {
		try {

			const response = await fetch(api, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',},
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

			const response = await fetch(api, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',},
			});

			if (!response.ok) {
				failed("Something went wrong!");
			}
			const data = await response.json();

			if (data.status) {
				success(data.message || "Success!")
			} else {
				failed(data.message || 'Something went wrong'); // You might want to adjust based on your API's error handling
			}
		} catch (error: any) {
			failed(error.message); // Invoke the failed callback with the error message
		}
	}
}
