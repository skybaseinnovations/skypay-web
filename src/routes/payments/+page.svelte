<script>
	import { isLoading, payments } from './../../stores';
	import { onMount } from 'svelte';

	import { GenericRepo } from './../../repo/GenericRepo';
	import { Api } from '../../utils/Api';
	import Master from '../../layouts/Master.svelte';
	import Swal from 'sweetalert2';
	import { Snackbarrgh } from '../../utils/Snackbarrgh';
	let repo = new GenericRepo();

	// Load payments list
	function load() {
		isLoading.set(true);
		repo.list(
			Api.PAYMENTS,
			null,
			(list) => {
				payments.set(list);
				isLoading.set(false);
			},
			(message) => {
				Snackbarrgh.error(message);
				isLoading.set(false);
			}
		);
	}

	onMount(load);

	/** Delete Item
	 * @param {string} id
	 */
	function deleteItem(id) {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#c61e37',
			cancelButtonColor: '#838383',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				isLoading.set(true);
				repo.destroy(
					`${Api.PAYMENTS}/${id}`,
					(message) => {
						Snackbarrgh.error(message);
						load();
						isLoading.set(false);
					},
					(message) => {
						Snackbarrgh.error(message);
						isLoading.set(false);
					}
				);
			}
		});
	}

	/**
	 * Update the status of the payment
	 * @param {{ id: any; }} payment
	 * @param {string} status
	 */
	function updateStatus(payment, status) {
		isLoading.set(true);
		repo.update(
			`${Api.PAYMENTS}/${payment.id}`,
			{
				status: status
			},
			(list) => {
				load();
				isLoading.set(false);
			},
			(message, e) => {
				Snackbarrgh.error(message);
				isLoading.set(false);
			}
		);
	}
</script>

<Master>
	<div>
		<div class="d-flex justify-content-between align-items-center pt-4 pb-3">
			<div>
				<h6 class="m-0">Payments</h6>
				<p class="m-0 text-muted">ghjh</p>
			</div>
			<div>
				
			</div>
		</div>

		<div class="row">
			{#if !$isLoading && $payments.length === 0}
				<div class="text-center d-flex justify-content-center align-items-center flex-column">
					<img style="height: 25vh" src="illustrations/error.svg" />
					<h6 class="mt-3">Oops!</h6>
					<p class="my-0 text-muted">No payments available.</p>
				</div>
			{:else}
				<table class="table table-bordered">
					<thead>
						<tr>
							<!-- <th>ID</th> -->
							<th>Code</th>
							<th>Provider</th>
							<th>Amount</th>
							<th>Status</th>
							<th>Created</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each $payments as payment (payment.id)}
							<tr>
								<!-- <td>{payment.id}</td> -->
								<td>{payment.code}</td>
								<td>{payment.provider_name}</td>
								<td>{payment.amount}</td>
								<td>{payment.status}</td>
								<td>{payment.created_at}</td>
								<td>
									{#if payment.status === 'pending' || payment.status === 'waiting'}
										<button
											class="btn btn-danger"
											on:click={() => updateStatus(payment, 'cancelled')}
										>
											Cancel
										</button>
										<button
											class="btn btn-danger"
											on:click={() => updateStatus(payment, 'invalid')}
										>
											Invalid
										</button>
										<button class="btn btn-success" on:click={() => updateStatus(payment, 'complete')}>
											Mark Paid
										</button>
									{:else if payment.status === 'Paid' || payment.status === 'cancelled'}
										<button
											class="btn btn-danger"
											on:click={() => updateStatus(payment, 'invalid')}
										>
											Invalid
										</button>
										{:else}
										<p class="text-muted">No actions available</p>
									{/if}
									<button
											class="btn btn-danger"
											on:click={() => deleteItem(payment.id)}
										>
											Delete
										</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</div>

</Master>
