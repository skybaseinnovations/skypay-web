<script>
	import { onMount } from 'svelte';
	import { Snackbarrgh } from '../../utils/Snackbarrgh.js';
	import CheckoutMaster from '../../layouts/CheckoutMaster.svelte';
	import { CheckoutRepo } from '../../repo/CheckoutRepo';
	import { activePayment, providers, selectedProvider, isLoading } from '../../checkout-stores';
	import ProviderList from './ProviderList.svelte';


	let repo = new CheckoutRepo();
	let data = {};

	$: if ($selectedProvider) {
		data = {
			'user_payment_provider_id': $selectedProvider.id,
			'code': '123',
			'amount': 120
		};
		// initiate();
	} else {
		data = {};
	}

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

	function initiate() {
		isLoading.set(true);
		repo.initiate(data, (p) => {
			isLoading.set(false);
			activePayment.set(p);
		}, (message) => {
			Snackbarrgh.error(message);
			isLoading.set(false);
		});
	}

	onMount(load);

	function changeStatus(status) {
		isLoading.set(true);
		const payload = {
			'status': status
		};
		repo.update($activePayment.id, payload, (p) => {
			isLoading.set(false);
			activePayment.set(p);
		}, (message) => {
			Snackbarrgh.error(message);
			isLoading.set(false);
		});
	}

	function changeProvider() {
		$selectedProvider = null;
	}
</script>

<CheckoutMaster>
	<div>
		{#if $selectedProvider}
			<p>{$selectedProvider.provider_name}</p>
		{/if}
		{#if !$activePayment || !$selectedProvider}
			<ProviderList />
		{:else}
			<button class="btn btn-primary d-flex align-items-center justify-content-center gap-1"
							on:click={() => changeProvider()}>
				Change Provider
			</button>
		{/if}
		<div class="d-flex justify-content-between align-items-center pt-4 pb-3">
			<div>
				<h6 class="m-0">My Payment Providers</h6>
			</div>
			{#if $activePayment}
				<p class="m-0 text-muted">{$activePayment.id}|{$activePayment.status}</p>
				<div>

					<button class="btn btn-primary d-flex align-items-center justify-content-center gap-1"
									on:click={() => changeStatus("Waiting")}>
						Mark as Paid
					</button>
					<button class="btn btn-primary d-flex align-items-center justify-content-center gap-1"
									on:click={() => changeStatus("Cancelled")}>
						Mark as Cancelled
					</button>
				</div>
			{:else}
				<button class="btn btn-primary d-flex align-items-center justify-content-center gap-1"
								on:click={() => initiate()}>
					Proceed to Pay
				</button>
			{/if}
		</div>
	</div>

</CheckoutMaster>
