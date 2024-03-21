<script>
	import { apiKey, isLoading, providers, selectedProvider } from '../../checkout-stores';
	import { onMount } from 'svelte';
	import { Snackbarrgh } from '../../utils/Snackbarrgh.js';
	import { CheckoutRepo } from '../../repo/CheckoutRepo';

	let repo = new CheckoutRepo($apiKey);

	function load() {
		isLoading.set(true);
		repo.providers((list) => {
			providers.set(list);
			isLoading.set(false);
		}, (message) => {
			Snackbarrgh.error(message);
			isLoading.set(false);
		});
	}

	onMount(load);

	// Function to update the selected provider based on selection
	function selectProvider(providerId) {
		const provider = $providers.find(p => p.id === providerId);
		if (provider) {
			selectedProvider.set(provider);
		}
	}
</script>

<div class="row d-flex align-items-center flex-column pt-4">
	<h5 class="">Please select your payment method</h5>

	<div class="d-flex gap-2">
		{#each $providers as provider (provider.id)}
			<div class="position-relative">
				<label for="{provider.id}"
							 class="d-flex justify-content-between dashed-border {$selectedProvider === provider.id ? 'active' : ''}  mt-3 provider-label"
							 style="cursor: pointer;">
					<div class="d-flex flex-column justify-content-center text-center gap-1">
						<img src="{provider.provider_logo_url}" width="40" height="40" class="object-fit-contain"
								 alt="{provider.provider_name}">
						<span>{provider.provider_name}</span>
					</div>
					<input on:change={() => selectProvider(provider.id)} name="provider_id" type="radio"
								 class="form-check-input d-none" id="{provider.id}" value="{provider.id}">
				</label>
				<img src="icons/upside-arrow.svg" alt="" width="16" style="position: absolute;top: 1.2rem;right: 0.4rem">

			</div>

		{/each}
	</div>

</div>
