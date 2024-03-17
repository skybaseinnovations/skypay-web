export class CheckoutApi {
	static BASE_URL = "http://localhost:8010/api";
	static PAYMENT_PROVIDERS = `${CheckoutApi.BASE_URL}/v1/checkout/providers`;
	static INITIATE = `${CheckoutApi.BASE_URL}/v1/checkout/initiate`;
	static PAYMENTS = `${CheckoutApi.BASE_URL}/v1/checkout/payments`;
}