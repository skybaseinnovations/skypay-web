<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
  
    // Pretend secure magic happens and we have our active payment data
    let activePayment = writable({
      amount: 100,
      tax_amount: 10,
      total_amount: 110,
      transaction_uuid: "unique-transaction-id",
      product_code: "EPAYTEST",
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: "https://esewa.com.np/success",
      failure_url: "https://esewa.com.np/failure",
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: "", // We'll fill this in onMount
    });
  
    // Simulated secret - Remember, keep this server-side IRL!
    const secretKey = "8gBm/:&EnhH.1/q(";
  
    onMount(async () => {
      // Simulate generating the signature
      activePayment.update((current) => {
        const dataToSign = `total_amount=${current.total_amount},transaction_uuid=${current.transaction_uuid},product_code=${current.product_code}`;
        // Placeholder for actual signature generation
        current.signature = btoa(dataToSign); // Simple Base64, replace with actual HMAC SHA256 logic
        return current;
      });
  
      // Auto-submit logic
      document.getElementById('esewa-payment-form')?.submit();
    });
  </script>
  
  <form id="esewa-payment-form" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
    <input type="hidden" name="amt" bind:value="{$activePayment.amount}">
    <input type="hidden" name="pdc" bind:value="{$activePayment.product_delivery_charge}">
    <input type="hidden" name="psc" bind:value="{$activePayment.product_service_charge}">
    <input type="hidden" name="txAmt" bind:value="{$activePayment.tax_amount}">
    <input type="hidden" name="tAmt" bind:value="{$activePayment.total_amount}">
    <input type="hidden" name="pid" bind:value="{$activePayment.transaction_uuid}">
    <input type="hidden" name="scd" bind:value="{$activePayment.product_code}">
    <input type="hidden" name="su" bind:value="{$activePayment.success_url}">
    <input type="hidden" name="fu" bind:value="{$activePayment.failure_url}">
    <input type="hidden" name="signed_field_names" bind:value="{$activePayment.signed_field_names}">
    <input type="hidden" name="signature" bind:value="{$activePayment.signature}">
    <!-- No visible input or submit button needed, auto-submit on mount -->
  </form>
  