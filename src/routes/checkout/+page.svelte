<script>
	import { onMount } from 'svelte';
	import { Snackbarrgh } from '../../utils/Snackbarrgh.js';
	import CheckoutMaster from '../../layouts/CheckoutMaster.svelte';
	import { CheckoutRepo } from '../../repo/CheckoutRepo';
	import {
		activePayment,
		providers,
		selectedProvider,
		isLoading,
		apiKey
	} from '../../checkout-stores';
	import ProviderList from './ProviderList.svelte';
	import { goto } from '$app/navigation';
	let repo = new CheckoutRepo(null);
	let stopCalled = false;
	let data = {};
	let baseInfo = {
		api_key: '',
		amount: 0.0,
		order_id: '002' //passed as order_id but our api takes it as code,
	};

	$: if ($selectedProvider) {
		data = {
			user_payment_provider_id: $selectedProvider.id,
			code: baseInfo.order_id,
			amount: baseInfo.amount
		};

		// alert(JSON.stringify(data));
		// initiate();
	} else {
		data = {};
	}

	$: if ($activePayment) {
		if ($activePayment.status === 'Cancelled') {
			stopCalled = true;
			goto('checkout/failure');
		} else if ($activePayment.status === 'Paid') {
			stopCalled = true;
			goto('checkout/success');
		}
	}

	onMount(() => {
		const params = new URLSearchParams(window.location.search);

		const apiKeyValue = params.get('api_key');
		const amount = parseFloat(params.get('amount') || 0);

		if (!apiKeyValue) {
			handleError('Api key is required!');
			return;
		}
		apiKey.set(apiKeyValue);
		repo.apiKey = apiKeyValue;
		if (amount < 10) {
			handleError('Amount must be greater than Rs. 10');
			return;
		}
		params.forEach((value, key) => {
			baseInfo[key] = value;
		});

		// load();
	});

	/**
	 * @param {string} message
	 */
	function handleError(message) {
		Snackbarrgh.error(message);
		goto('/checkout/failure?message=' + encodeURIComponent(message));
	}

	function initiate() {
		isLoading.set(true);
		repo.initiate(
			data,
			(p) => {
				isLoading.set(false);
				activePayment.set(p);
				listenPayment();
			},
			(message) => {
				Snackbarrgh.error(message);
				isLoading.set(false);
			}
		);
	}

	// Function to listen for payment 🎧💰
	function listenPayment() {
		Snackbarrgh.info('listen');
		isLoading.set(true); // Set loading state
		repo.payment(
			$activePayment.id,
			(p) => {
				// Callback if payment received
				isLoading.set(false); // Turn off loading state
				activePayment.set(p); // Set active payment
			},
			(message) => {
				// Callback if error
				Snackbarrgh.error(message); // Show error message
				isLoading.set(false); // Turn off loading state
			}
		);

		// If stop is not called, listen again after 5 seconds ⏰
		if (!stopCalled) {
			setTimeout(listenPayment, 5000); // Call listenPayment again after 5 seconds
		}
	}

	// Function to stop listening for payment 🛑
	function stopListeningPayment() {
		stopCalled = true; // Set stopCalled to true
		// You can add any other cleanup tasks here if needed
	}

	/**
	 * @param {string} status
	 */
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
			{#if $apiKey}
				<ProviderList />
			{/if}
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
