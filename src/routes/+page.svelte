<script>
	// @ts-ignore
	import { isLoading, payments, user } from '../stores';
	import { onMount } from 'svelte';
	import { GenericRepo } from '../repo/GenericRepo';
	import { Api } from '../utils/Api';
	import Master from '../layouts/Master.svelte';
	// @ts-ignore
	import Swal from 'sweetalert2';
	import { Snackbarrgh } from '../utils/Snackbarrgh';
	import { writable } from 'svelte/store';

	let repo = new GenericRepo();
	let dashboardData = writable({}); // Initialize with an empty object

	// Load payments list
	function load() {
		isLoading.set(true);
		repo.list(
			Api.DASHBOARD,
			// @ts-ignore
			null,
			(dataX) => {
				isLoading.set(false);
				// @ts-ignore
				dashboardData.set(dataX);
			},
			(message) => {
				Snackbarrgh.error(message);
				isLoading.set(false);
			}
		);
	}

	onMount(load);
</script>

<Master>
	<div>
		<div class="d-flex justify-content-between align-items-center pt-4 pb-3">
			<div>
				<h6 class="m-0">Dashboard</h6>
				<p class="m-0 text-muted">ghjh</p>
			</div>
			<div></div>
		</div>
		<hr />
		<div class="row">
			<p>Check Sample Payment</p>
			<a target="_blank" href="checkout?api_key={$user?.api_key}&amount=220"
				>Pay Rs. 10 with SkyPay <svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-arrow-right"
					><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"
					></polyline></svg
				></a
			>
		</div>
		<hr />
		<div class="row">
			{#if $dashboardData}
				<p>Total Payments: {$dashboardData.totalPayments}</p>
				<p>Cancelled Payments: {$dashboardData.cancelledCount}</p>
				<p>Success Payments: {$dashboardData.successCount}</p>
				<p>Invalid Payments: {$dashboardData.invalidCount}</p>
			{/if}
		</div>
	</div>
</Master>
