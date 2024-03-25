<script lang="ts">
	import { onMount } from 'svelte';
	import { activePayment } from '../../../checkout-stores';


	onMount(() => {
		if ($activePayment.success_url && typeof window !== 'undefined') {
			setTimeout(() => {
				window.location.href = $activePayment.success_url;
			}, 3000); // Wait for 3 seconds (3000 milliseconds) before redirecting
		}
	});
</script>

<div>
	{#if $activePayment}
		{#if $activePayment?.status == 'complete'}
			success
			{#if $activePayment?.success_url}
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
