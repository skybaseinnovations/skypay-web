import { PUBLIC_CHECKOUT_BASE_API_URL } from '$env/static/public';

export class CheckoutApi {
	static BASE_URL = PUBLIC_CHECKOUT_BASE_API_URL;
	static PAYMENT_PROVIDERS = `${CheckoutApi.BASE_URL}/v1/checkout/providers`;
	static INITIATE = `${CheckoutApi.BASE_URL}/v1/checkout/initiate`;
	static PAYMENTS = `${CheckoutApi.BASE_URL}/v1/checkout/payments`;
}