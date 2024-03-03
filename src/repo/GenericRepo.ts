
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
				failed(data.message || 'Something went wrong during login'); // You might want to adjust based on your API's error handling
			}
		} catch (error: any) {
			failed(error.message); // Invoke the failed callback with the error message
		}
	}
}
