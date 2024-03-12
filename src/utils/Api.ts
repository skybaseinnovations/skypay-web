export class Api {
	static BASE_URL = "http://192.168.1.74:8010/api";
	static SIGNIN = `${Api.BASE_URL}/v1/user/signin`;
	static SIGNUP = `${Api.BASE_URL}/v1/user/signup`;
	static PROVIDERS = `${Api.BASE_URL}/v1/core/providers`;
	static PAYMENT_PROVIDERS = `${Api.BASE_URL}/v1/core/payment-providers`;
}