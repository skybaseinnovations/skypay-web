<script>
	import { onMount } from 'svelte';
	import { Snackbarrgh } from '../../utils/Snackbarrgh.js';
	import CheckoutMaster from '../../layouts/CheckoutMaster.svelte';
	import { CheckoutRepo } from '../../repo/CheckoutRepo';
	import { activePayment, providers, selectedProvider, isLoading } from '../../checkout-stores';
	import ProviderList from './ProviderList.svelte';
	import { goto } from '$app/navigation';
	let repo = new CheckoutRepo();
	let data = {};
	let baseInfo = {
		'api_key': '',
		'amount': 0.0,
		'order_id': '002', //passed as order_id but our api takes it as code,
	};

	$: if ($selectedProvider) {
		data = {
			user_payment_provider_id: $selectedProvider.id,
			code: baseInfo.order_id,
			amount: baseInfo.amount
		};

		alert(JSON.stringify(data));
		// initiate();
	} else {
		data = {};
	}

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		params.forEach((value, key) => {
			baseInfo[key] = value;
		})
		if(baseInfo.amount <10){
			Snackbarrgh.error("Amount must be greater than Rs. 10")
			goto('/failure?message=Amount must be greater than Rs. 10')
		}
		load()
	});

	function load() {
		isLoading.set(true);
		repo.providers( baseInfo.api_key,
			(list) => {
				providers.set(list);
				isLoading.set(false);
			},
			(message) => {
				Snackbarrgh.error(message);
				isLoading.set(false);
			}
		);
	}

	function initiate() {
		isLoading.set(true);
		repo.initiate(
			data,
			(p) => {
				isLoading.set(false);
				activePayment.set(p);
			},
			(message) => {
				Snackbarrgh.error(message);
				isLoading.set(false);
			}
		);
	}

	function changeStatus(status) {
		isLoading.set(true);
		const payload = {
			status: status
		};
		repo.update(
			$activePayment.id,
			payload,
			(p) => {
				isLoading.set(false);
				activePayment.set(p);
			},
			(message) => {
				Snackbarrgh.error(message);
				isLoading.set(false);
			}
		);
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
			<button
				class="btn btn-primary d-flex align-items-center justify-content-center gap-1"
				on:click={() => changeProvider()}
			>
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
					<button
						class="btn btn-primary d-flex align-items-center justify-content-center gap-1"
						on:click={() => changeStatus('Waiting')}
					>
						Mark as Paid
					</button>
					<button
						class="btn btn-primary d-flex align-items-center justify-content-center gap-1"
						on:click={() => changeStatus('Cancelled')}
					>
						Mark as Cancelled
					</button>
				</div>
			{:else}
				<button
					class="btn btn-primary d-flex align-items-center justify-content-center gap-1"
					on:click={() => initiate()}
				>
					Proceed to Pay
				</button>
			{/if}
		</div>
	</div>
</CheckoutMaster>
