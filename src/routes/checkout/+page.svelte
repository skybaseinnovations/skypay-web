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
		// if($activePayment){
		// 	initiate();
		// }
	} else {
		data = {};
	}

	$: if ($activePayment) {
		if ($activePayment.status === 'cancelled') {
			stopCalled = true;
			goto('checkout/failure');
		} else if ($activePayment.status === 'complete') {
			stopCalled = true;
			goto('checkout/success');
		}
	}

	onMount(() => {
		const params = new URLSearchParams(window.location.search);

		const apiKeyValue = params.get('api_key');
		const amount = parseFloat(params.get('amount') || 0);

		if (!apiKeyValue || apiKeyValue == "null") {
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
				if (p.mode === 'API') {
					goto('/checkout/process/esewa');
					activePayment.set(p);
				} else {
					activePayment.set(p);
					listenPayment();
				}
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
	<div class="row d-flex justify-content-center">
		<div class="d-flex justify-content-center pt-4">
			<img src="logo.svg" alt="" width="150" />
		</div>
		<div class="col-md-10 card p-4 mt-4">
			<div class="row">
				<div class="col-md-6 p-4">
					<div class="d-flex gap-1 align-items-center">
						<img src="/icons/arrow.svg" alt="" width="24" />
						<span>Back to Merchant</span>
					</div>
					<div class="pt-3">
						<h6>Order Details</h6>
						{#if $activePayment}
							<div class="d-flex justify-content-between align-items-center card-01 p-3 mt-2">
								<div class="d-flex flex-column">
									<h6 class="m-0">XXX</h6>
									<label for="">Order #12455</label>
								</div>
								<div class="d-flex gap-1 align-items-end">
									<span>Rs.</span>
									<h3 class="m-0">{$activePayment.amount}</h3>
								</div>
							</div>
							<!-- {JSON.stringify($activePayment)} -->
						{:else}
							<div class="d-flex justify-content-between align-items-center card-01 p-3 mt-2">
								<div class="d-flex flex-column">
									<h6 class="m-0">XXX</h6>
									<label for="">Order #12455</label>
								</div>
								<div class="d-flex gap-1 align-items-end">
									<span>Rs.</span>
									<h3 class="m-0">{baseInfo?.amount}</h3>
								</div>
							</div>
						{/if}
					</div>
					{#if $selectedProvider}
						<div class="pt-3">
							<div class="d-flex justify-content-between">
								<h6>Selected Payment</h6>
								{#if $activePayment && $selectedProvider}
									<!-- <a on:click={() => changeProvider()}>Change</a> -->
								{/if}
							</div>
							<div class="d-flex justify-content-between align-items-center card-01 p-3 mt-2">
								<div class="d-flex gap-2 align-items-center">
									<img
										src={$selectedProvider.provider_logo_url}
										alt=""
										width="50"
										height="50"
										class="object-fit-contain"
									/>
									<h5 class="m-0">{$selectedProvider.provider_name}</h5>
								</div>
								<div class="payment-type d-flex gap-1 align-items-center">
									{$selectedProvider.mode}
									{#if $selectedProvider.mode === 'Manual'}
										<img src="/icons/x.svg" alt="" width="12" />
									{:else}
										<img src="/icons/upside-arrow.svg" alt="" width="12" />
									{/if}
								</div>
							</div>
						</div>
					{/if}

					<div class="pt-5">
						{#if $selectedProvider?.mode === 'API'}
							<div class="info-payment d-flex align-items-center pb-2">
								<img alt="" src="icons/info.svg" width="16" /><span
									>You will be redirected to the {$selectedProvider.provider_name}’s payment page</span
								>
							</div>
						{/if}
						{#if $activePayment}
							{#if $activePayment.status === 'pending'}
								<button
									on:click={() => changeStatus('waiting')}
									class="btn btn-tertiary d-flex align-items-center justify-content-center gap-1 w-100"
								>
									Mark as Paid <img alt="" src="icons/check.svg" width="18" />
								</button>
							{/if}
							{#if $activePayment.status === 'waiting'}
								<button class="btn d-flex align-items-center justify-content-center gap-1 w-100">
									Waiting ...
								</button>
								<button
									class="mt-2 btn btn-outline-danger d-flex align-items-center justify-content-center gap-1 w-100"
									on:click={() => changeStatus('cancelled')}
								>
									Mark as Cancelled
								</button>
							{/if}
						{:else}
							<button
								class="btn btn-tertiary d-flex align-items-center justify-content-center gap-1 w-100"
								on:click={() => initiate()}
							>
								Proceed to Pay
							</button>
						{/if}
					</div>
				</div>

				{#if $activePayment && $selectedProvider}
					{#if $activePayment.mode !== 'API'}
						<div class="col-md-6 border-left p-4">
							<div class="info-payment d-flex align-items-center justify-content-end pb-2">
								<img alt="" src="icons/info.svg" width="16" /><span>See how it works?</span>
							</div>
							<label for="">Please send the amount to these details</label>
							<div class=" card-01 p-3 mt-2">
								<table class="personal-details-table">
									<tr>
										<td>Account Username </td>
										<td>
											: {$activePayment?.data?.username}
											<img src="icons/copy.svg" width="16" alt="" /></td
										>
									</tr>
									<tr>
										<td>Account Name </td>
										<td>
											: {$activePayment?.data?.name}
											<img src="icons/copy.svg" width="16" alt="" /></td
										>
									</tr>
									<!-- <tr>
									<td>Remarks </td>
									<td> : 6763 <img src="icons/copy.svg" width="16" alt="" /></td>
								</tr> -->
								</table>
							</div>
							<div>
								<div class="d-flex gap-2 align-items-center justify-content-center pt-4">
									<div style="border-top: 1px solid #e3e3e3;width: 30%;height: 100%"></div>
									<label for="">or Pay with following QR</label>
									<div style="border-top: 1px solid #e3e3e3;width: 30%;height: 100%"></div>
								</div>
								<div class="d-flex justify-content-center align-items-center pt-3">
									<img src="qr.png" alt="" width="180" height="180" class="object-fit-contain" />
								</div>
							</div>
						</div>
					{:else}
						<div class="col-md-6 border-left p-4">
							<p>Redirecting...</p>
						</div>
					{/if}
				{:else}
					<div class="col-md-6 border-left p-4">
						<div class="">
							{#if !$activePayment || !$selectedProvider}
								{#if $apiKey}
									<ProviderList />
								{/if}
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
		<!--	Footer Links	-->
		<div class="footer-links d-flex justify-content-center align-items-center gap-2 py-5">
			<a href="#">Terms</a>
			<a href="#">Policy</a>
		</div>
	</div>
</CheckoutMaster>
