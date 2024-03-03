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
		id: "",
		code: "",
		name: "",
		status: false,
		description: "",
		website_url: "",
		documentation_url: "",
		support_email: "",
		region: "",
		integration_difficulty: "Medium", // Default selection
		signup_url: "",
		api_version: "",
		rating: null,
		featured: false
		// include other fields
	};


	// Reactive statement for editing logic
	$: if (editingId) {
		const itemToEdit = $providers.find(item => item.id === editingId);
		if (itemToEdit) {
			// formState = null;
			formState = itemToEdit;
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
		formState = provider;
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
			confirmButtonColor: "#1ec677",
			cancelButtonColor: "#b42222",
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
								<label for="code">Code</label>
								<input type="text" class="form-control" id="code" bind:value={formState.code}>
							</div>

							<div class="form-group">
								<label for="name">Name</label>
								<input type="text" class="form-control" id="name" bind:value={formState.name}>
							</div>

							<div class="form-group">
								<label for="status">Status</label>
								<div class="custom-control custom-switch">
									{formState.status}
									<input type="checkbox" class="custom-control-input" id="status" bind:checked={formState.status}>
									<label class="custom-control-label" for="status">Active</label>
								</div>
							</div>

							<div class="form-group">
								<label for="description">Description</label>
								<textarea class="form-control" id="description" bind:value={formState.description}></textarea>
							</div>

							<div class="form-group">
								<label for="integrationDifficulty">Integration Difficulty</label>
								<select class="form-control" id="integrationDifficulty" bind:value={formState.integration_difficulty}>
									<option>Easy</option>
									<option>Medium</option>
									<option>Hard</option>
								</select>
							</div>

							<div class="form-group">
								<label for="featured">Featured</label>
								<div class="custom-control custom-checkbox">
									<input type="checkbox" class="custom-control-input" id="featured" bind:checked={formState.featured}>
									<label class="custom-control-label" for="featured">Yes</label>
								</div>
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
