<script>
	import { isLoading, providers, user } from './../../stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Master from '../../layouts/Master.svelte';
	import { AuthRepo } from '../../repo/AuthRepo';
	import { Api } from '../../utils/Api';
	// @ts-ignore
	import Swal from 'sweetalert2';
	import { Snackbarrgh } from '../../utils/Snackbarrgh';

	let repo = new AuthRepo();

	// Load payments list
	function generateApiKey() {
		Swal.fire({
			title: 'Generate New API Key',
			text: "Are you sure you want to generate a new API key? This action will invalidate the old key, and you won't be able to revert it.",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#c61e37',
			cancelButtonColor: '#838383',
			confirmButtonText: 'Yes, generate new key'
		}).then((result) => {
			if (result.isConfirmed) {
				isLoading.set(true);
				repo.generateApiKey(
					(dataX) => {
						isLoading.set(false);
						Snackbarrgh.success('Successfully generated!');
					},
					(message) => {
						Snackbarrgh.error(message);
						isLoading.set(false);
					}
				);
			}
		});
	}
</script>

<Master>
	<div class="container">
		<div>
			<p>Name: {$user?.name}</p>
			<p>Email: {$user?.email}</p>
			<p>Phone: {$user?.phone}</p>
			<p>API Key: {$user?.api_key ?? 'Not set. Please contact admin'}</p>
			<button on:click={() => generateApiKey()}> New Api Key </button>
		</div>
	</div>
</Master>
