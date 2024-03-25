<script lang="ts">
	import { activePayment } from '../../../../checkout-stores';
</script>

<body>
	{#if $activePayment}
		<form action={$activePayment.process_data.url} method={$activePayment.process_data.method}>
			{#each Object.entries($activePayment.process_data.fields) as [name, value]}
				<input type="text" id={name} {name} {value} required />
			{/each}
			<input type="submit" value="Submit" />
		</form>
	{:else}
		loading ...
	{/if}
</body>

<!-- <body>
	<form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
		<input type="text" id="amount" name="amount" value="100" required />
		<input type="text" id="tax_amount" name="tax_amount" value="0" required />
		<input type="text" id="total_amount" name="total_amount" value="100" required />
		<input type="text" id="transaction_uuid" name="transaction_uuid" value={$activePayment.tid} />
		<input type="text" id="product_code" name="product_code" value="EPAYTEST" required />
		<input
			type="text"
			id="product_service_charge"
			name="product_service_charge"
			value="0"
			required
		/>
		<input
			type="text"
			id="product_delivery_charge"
			name="product_delivery_charge"
			value="0"
			required
		/>
		<input type="text" id="success_url" name="success_url" value="https://esewa.com.np" required />
		<input type="text" id="failure_url" name="failure_url" value="https://google.com" required />
		<input
			type="text"
			id="signed_field_names"
			name="signed_field_names"
			value="total_amount,transaction_uuid,product_code"
			required
		/>
		<input type="text" id="signature" name="signature" value={$activePayment?.esewa} required />
		<input value="Submit" type="submit" />
	</form>
</body> -->
