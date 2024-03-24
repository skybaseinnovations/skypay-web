<script lang="ts">
	import { onMount } from 'svelte';

	export let data: any; // This prop is received from +page.server.js

	onMount(() => {
		console.log('Payment Data on client-side:', data.payment);
		if (data.payment.success_url && typeof window !== 'undefined') {
			setTimeout(() => {
				window.location.href = data.payment.success_url;
			}, 3000); // Wait for 3 seconds (3000 milliseconds) before redirecting
		}
	});
</script>

<div>
	{#if data.payment}
		{#if data.payment.status == 'complete'}
			success 
			{#if data.payment.success_url}
				<p>You'll be redirected in a while</p>
			{/if}
		{:else}
			FAILED
		{/if}
	{:else}
		Loading...
	{/if}
</div>

<style>
</style>
