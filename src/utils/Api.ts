export class Api {
	static BASE_URL = "http://localhost:8010/api";
	static SIGNIN = `${Api.BASE_URL}/v1/user/signin`;
	static SIGNUP = `${Api.BASE_URL}/v1/user/signup`;
	static GENERATE_API_KEY = `${Api.BASE_URL}/v1/user/generate-api-key`;
	static UPDATE_PROFILE = `${Api.BASE_URL}/v1/user/update-profile`;
	static PROVIDERS = `${Api.BASE_URL}/v1/core/providers`;
	static PAYMENTS = `${Api.BASE_URL}/v1/core/payments`;
	static DASHBOARD = `${Api.BASE_URL}/v1/core/dashboard`;
	static PAYMENT_PROVIDERS = `${Api.BASE_URL}/v1/core/payment-providers`;
}