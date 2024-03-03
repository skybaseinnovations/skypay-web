<script>
	import { isLoading, providers } from './../../stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { slide, fade } from 'svelte/transition';

	import { GenericRepo } from './../../repo/GenericRepo';
	import { Api } from '../../utils/Api';

	import Master from '../../layouts/Master.svelte';
	import { quintOut } from 'svelte/easing';

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
			providers.set(list); // Using `set` to update the Svelte store directly
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
		repo.destroy(`${Api.PROVIDERS}/${id}`, (message) => {
			load();
			isLoading.set(false);
		}, (message) => {
			alert(message);
			isLoading.set(false);
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
		<div class="d-flex justify-content-between align-items-center pt-4 pb-3">
			<div>
				<h6 class="m-0">Providers</h6>
				<p class="m-0 text-muted">ghjh</p>
			</div>
			<div>
				<button class="btn btn-primary d-flex align-items-center justify-content-center gap-1" on:click={() => create()}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Create</button>
			</div>
		</div>

		<div class="row">

			{#each $providers as provider (provider.id)}
				<div class="col-md-2 ">
					<div class="card p-2 mt-2 position-relative">
						<div class="d-flex flex-column gap-2 align-items-end justify-content-end" style="position: absolute;right: 0.5rem;">
							<button class="border-0 text-primary bg-transparent d-flex align-items-center justify-content-center p-0" on:click={() => openModal(provider)}>
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
							</button>
							<button class="border-0 text-danger bg-transparent d-flex align-items-center justify-content-center p-0" on:click={() => deleteProvider(provider.id)}>
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
							</button>
						</div>
						<div class="provider-item pt-4">
							<div class="d-flex flex-column gap-1 justify-content-center align-items-center">
								<img src="" height="80" width="80" class="object-fit-contain" alt="">
								<h6>{provider.name}</h6>
							</div>
						</div>
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
