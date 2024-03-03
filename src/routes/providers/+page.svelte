<script>
	import { isLoading, providers } from './../../stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { slide, fade } from 'svelte/transition';

	import { GenericRepo } from './../../repo/GenericRepo';
	import { Api } from '../../utils/Api';

	import Master from '../../layouts/Master.svelte';
	import { quintOut } from 'svelte/easing';
	import Swal from 'sweetalert2';

	let showModal = writable(false);
	let repo = new GenericRepo();
	export let editingId = null;

	let formState = {
		id: '',
		name: '',
		code: ''
		// include other fields
	};


	// Reactive statement for editing logic
	$: if (editingId) {
		const itemToEdit = $providers.find(item => item.id === editingId);
		if (itemToEdit) {
			formState = { ...itemToEdit };
		}
	}

	// Load providers list
	function load() {

		repo.list(Api.PROVIDERS, null, (list) => {
			providers.set(list);
		}, (message) => {
			alert(message);
		});
	}

	onMount(load);

	// Handle form submission
	// function handleSubmit() {
	//   if (editingId) {
	// 	providers.update(current => {
	// 	  return current.map(provider => provider.id === editingId ? formState : provider);
	// 	});
	//   } else {
	// 	providers.update(current => [...current, { ...formState, id: Date.now().toString() }]);
	//   }
	//   // Reset formState and editingId after submission
	//   formState = { name: '', /* reset other fields */ };
	//   editingId = null;
	// }

	// Function to delete a provider
	function openModal(provider) {
		formState.id = provider.id;
		formState.name = provider.name;
		formState.code = provider.code;
		showModal.set(true);
	}

	function closeModal() {
		showModal.set(false);
	}


	function deleteProvider(id) {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#c61e2c",
			cancelButtonColor: "#a1a1a1",
			confirmButtonText: "Yes, delete it!"
		}).then((result) => {
			if (result.isConfirmed) {
				repo.destroy(`${Api.PROVIDERS}/${id}`, (message) => {
					load();
					isLoading.set(false);
				}, (message) => {
					alert(message);
					isLoading.set(false);
				});
			}
		});
	}

	function save() {
		isLoading.set(true);
		if (formState.id != null) {
			repo.update(`${Api.PROVIDERS}/${formState.id}`, formState, (list) => {
				closeModal();
				load();
				isLoading.set(false);
			}, (message) => {
				alert(message);
				isLoading.set(false);
			});
		} else {
			repo.store(`${Api.PROVIDERS}`, formState, (data) => {
				closeModal();
				load();
				isLoading.set(false);
			}, (message) => {
				alert(message);
				isLoading.set(false);
			});
		}

	}

	function create() {
		openModal({});
	}
</script>

<Master>
	<div class="container">
		<div class="row">
			<button on:click={() => create()}>Create</button>
			{#each $providers as provider (provider.id)}
				<div class="col-md-3 card p-2">
					<div class="provider-item">
						<p>{provider.name}</p>
						<button class="btn btn-primary" on:click={() => openModal(provider)}>Edit</button>
						<button class="btn btn-danger" on:click={() => deleteProvider(provider.id)}>Delete</button>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Modal -->
	{#if $showModal}
		<div transition:fade={{ duration: 250 }} class={'modal-backdrop fade show'}></div>
		<div transition:fade={{ duration: 250 }} class={'modal d-block'} id="editProviderModal"
				 tabindex="-1"
				 role="dialog" aria-labelledby="editProviderModalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="editProviderModalLabel">Edit Provider</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<form on:submit|preventDefault={save}>
							<div class="form-group">
								<label for="providerName">Name</label>
								<input type="text" class="form-control" id="providerName" bind:value={formState.name}>
							</div>
							<div class="form-group">
								<label for="providerCode">Code</label>
								<input type="text" class="form-control" id="providerCode" bind:value={formState.code}>
							</div>
							<div class="modal-footer">
								{#if $isLoading}
									<p>Loading..</p>
								{:else}
									<button on:click={()=>closeModal()} type="button" class="btn btn-secondary" data-dismiss="modal">Close
									</button>
									<button on:click={()=>save()} type="submit" class="btn btn-primary">Save</button>
								{/if}
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	{/if}


</Master>
