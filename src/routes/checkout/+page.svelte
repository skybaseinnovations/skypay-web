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
	<div class="row d-flex justify-content-center">
		<div class="d-flex justify-content-center pt-4">
			<img src="logo.svg" alt="" width="150">
		</div>
		<div class="col-md-10 card p-4 mt-4">
			<div class="row">
				<div class="col-md-6 p-4">
					<div class="d-flex gap-1 align-items-center">
						<img src="/icons/arrow.svg" alt="" width="24">
						<span>Back to Merchant</span>
					</div>
					<div class="pt-3">
						<h6>Order Details</h6>
						<div class="d-flex justify-content-between align-items-center card-01 p-3 mt-2">
							<div class="d-flex flex-column ">
								<h6 class="m-0">SaralNova</h6>
								<label for="">Order #12455</label>
							</div>
							<div class="d-flex gap-1 align-items-end">
								<span>Rs.</span>
								<h3 class="m-0">789.00</h3>
							</div>
						</div>
					</div>
					<div class="pt-3">
						<h6>Selected Payment</h6>
						<div class="d-flex justify-content-between align-items-center card-01 p-3 mt-2">
							<div class="d-flex gap-2 align-items-center">
								<img src="qr.png" alt="" width="50" height="50" class="object-fit-contain">
								<h5 class="m-0">SaralNova</h5>
							</div>
							<div class="payment-type d-flex gap-1 align-items-center">Manual / QR <img src="/icons/upside-arrow.svg"
																																												 alt="" width="12"></div>
						</div>
					</div>
					<div class="pt-5">
						<button
							class="btn btn-tertiary d-flex align-items-center justify-content-center gap-1 w-100"
							on:click={() => initiate()}
						>
							Proceed to Pay
						</button>
					</div>

				</div>
				<div class="col-md-6 border-left p-4">
					<div class="">
						{#if !$activePayment || !$selectedProvider}
							{#if $apiKey}
								<ProviderList />
							{/if}
						{/if}
					</div>
				</div>
			</div>
			{#if $selectedProvider}
				<p>{$selectedProvider.provider_name}</p>
			{/if}
<!--  Payment Options-->
			<div class="d-flex flex-column pt-4 pb-3 gap-2">
				{#if $activePayment}
					<div class="d-flex flex-column gap-2">
						<p class="m-0 text-muted">{$activePayment.id}|{$activePayment.status}</p>
						<div class='d-flex justify-content-between'>
							<div>
								{#if $activePayment && $selectedProvider}

									<button
										class="btn btn-primary d-flex align-items-center justify-content-center gap-1"
										on:click={() => changeProvider()}
									>
										Change Provider
									</button>
								{/if}
							</div>
							<div class="d-flex gap-2 justify-content-end">
								<button
									class="btn btn-outline-primary d-flex align-items-center justify-content-center gap-1"
									on:click={() => changeStatus('Cancelled')}
								>
									Mark as Cancelled
								</button>
								<button
									class="btn btn-primary d-flex align-items-center justify-content-center gap-1"
									on:click={() => changeStatus('Waiting')}
								>
									Mark as Paid
								</button>
							</div>
						</div>
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



<!--		QR Checkout Sections-->
		<div class="col-md-10 card p-4 mt-4">
			<div class="row">
				<div class="col-md-6 p-4">
					<div class="d-flex gap-1 align-items-center">
						<img src="/icons/arrow.svg" alt="" width="24">
						<span>Back to Merchant</span>
					</div>
					<div class="pt-3">
						<h6>Order Details</h6>
						<div class="d-flex justify-content-between align-items-center card-01 p-3 mt-2">
							<div class="d-flex flex-column ">
								<h6 class="m-0">SaralNova</h6>
								<label for="">Order #12455</label>
							</div>
							<div class="d-flex gap-1 align-items-end">
								<span>Rs.</span>
								<h3 class="m-0">789.00</h3>
							</div>
						</div>
					</div>
					<div class="pt-3">
						<h6>Selected Payment</h6>
						<div class="d-flex justify-content-between align-items-center card-01 p-3 mt-2">
							<div class="d-flex gap-2 align-items-center">
								<img src="qr.png" alt="" width="50" height="50" class="object-fit-contain">
								<h5 class="m-0">SaralNova</h5>
							</div>
							<div class="payment-type d-flex gap-1 align-items-center">Manual / QR <img src="/icons/upside-arrow.svg"
																																												 alt="" width="12"></div>
						</div>
					</div>
					<div class="pt-5">
						<div class="info-payment d-flex align-items-center pb-2"><img alt="" src="icons/info.svg" width="16"><span>You will  be redirected to the  Khalti’s payment page</span></div>
						<div class="pt-1">
							<button
								class="btn btn-tertiary d-flex align-items-center justify-content-center gap-1 w-100"
							>
								Mark as Paid <img alt="" src="icons/check.svg" width="18">
							</button>
						</div>
					</div>
				</div>
				<div class="col-md-6 border-left p-4">
					<div class="info-payment d-flex align-items-center justify-content-end pb-2"><img alt="" src="icons/info.svg" width="16"><span>See how it works?</span></div>
					<label for="">Please send the amount to these details</label>
					<div class=" card-01 p-3 mt-2">
					<table class="personal-details-table">
						<tr>
							<td>Account Name </td>
							<td> :  Sonaam Hitang <img src="icons/copy.svg" width="16" alt=""></td>
						</tr>
						<tr>
							<td>Account Number </td>
							<td> :  98234567890  <img src="icons/copy.svg" width="16" alt=""></td>
						</tr>
						<tr>
							<td>Remarks </td>
							<td> : 6763  <img src="icons/copy.svg" width="16" alt=""></td>
						</tr>
					</table>
					</div>
          <div>
						<div class="d-flex gap-2 align-items-center justify-content-center pt-4">
							<div style="border-top: 1px solid #e3e3e3;width: 30%;height: 100%">
							</div>
							<label for="">or Pay with following QR</label>
							<div style="border-top: 1px solid #e3e3e3;width: 30%;height: 100%">
							</div>
						</div>
						<div class="d-flex justify-content-center align-items-center pt-3">
							<img src="qr.png" alt="" width="180" height="180" class="object-fit-contain">
						</div>
					</div>

				</div>
			</div>

		</div>

<!--	Footer Links	-->
		<div class="footer-links d-flex justify-content-center align-items-center gap-2 py-5">
			<a href="#">Terms</a>
			<a href="#">Policy</a>
		</div>
	</div>
</CheckoutMaster>
