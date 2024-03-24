// src/routes/success/[method]/+page.server.js

import { goto } from '$app/navigation';
import { redirect } from '@sveltejs/kit';
import { activePayment } from '../../../../checkout-stores';
import { CheckoutRepo } from '../../../../repo/CheckoutRepo';

export async function load({ params, url }) {
  // `params.method` captures the payment method dynamically (e.g., 'esewa', 'khalti', 'imepay')
  const provider = params.provider;

  // Fetch the 'data' query parameter
  const encodedData = url.searchParams.get('data');

  // Decode the data as needed (assuming Base64 for demonstration purposes)
  let decodedData = null;
  if (encodedData) {
    try {
      // For server-side JavaScript (Node.js), use Buffer to decode from Base64
      const decodedString = Buffer.from(encodedData, 'base64').toString('utf-8');
      // If the decoded string is JSON, you can parse it into an object
      decodedData = JSON.parse(decodedString);
    } catch (error) {
      console.error('Error decoding data:', error);
    }
  }

  // Log the payment method and decoded data for verification or further processing
  console.log(`Payment Method: ${provider}`, 'Decoded Data:', decodedData);

  const transactionId = decodedData.transaction_uuid
  // Return the decoded data and payment method to your Svelte component as props
  const payload = {
    "status": "success",
    "transaction_id": transactionId,
    "provider": provider,
    "data": decodedData
  }
  let repo = new CheckoutRepo("");
  try {
    const paymentData = await repo.process(payload);
    console.log(`Payment Data: ${JSON.stringify(paymentData)}`);

    //TODO Redirect code here
    return {
      'payment': paymentData
    };
  } catch (error) {
    console.error(error);
    // Handle error, possibly redirect to a failure page
    return {
      status: 302,
      redirect: '/checkout/failure',
    };
  }

}
