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

<div>
	{#each $providers as provider (provider.id)}
		<div class="col-md-6">
			<label for="{provider.id}"
						 class="d-flex justify-content-between dashed-border {$selectedProvider === provider.id ? 'active' : ''} py-3 px-4 mt-3"
						 style="cursor: pointer;">
				<div class="d-flex gap-2">
					<img src="{provider.provider_logo_url}" width="24" height="24" class="object-fit-contain" alt="{provider.provider_name}">
					<span>{provider.provider_name}</span>
					<div class="badge badge-primary">{provider.mode}</div>
				</div>
				<input on:change={() => selectProvider(provider.id)} name="provider_id" type="radio"
							 class="form-check-input" id="{provider.id}" value="{provider.id}">
			</label>
		</div>
	{/each}
</div>
