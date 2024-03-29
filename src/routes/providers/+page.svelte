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
	import SkyTextInput from '../../components/SkyTextInput.svelte';
	import { Snackbarrgh } from '../../utils/Snackbarrgh.js';
	import SkySelect from '../../components/SkySelect.svelte';
	import SkySwitch from '../../components/SkySwitch.svelte';
	import SkyImageInput from '../../components/SkyImageInput.svelte';

	let showModal = writable(false);
	let repo = new GenericRepo();
	export let editingId = null;

	let formState = {
		id: '',
		code: '',
		name: '',
		status: false,
		description: '',
		website_url: '',
		documentation_url: '',
		support_email: '',
		region: '',
		integration_difficulty: 'Medium', // Default selection
		signup_url: '',
		api_version: '',
		rating: null,
		featured: false,
		image: null
		// include other fields
	};
	let errors = {};

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
		isLoading.set(true);
		repo.list(Api.PROVIDERS, null, (list) => {
			providers.set(list);
			isLoading.set(false);
		}, (message) => {
			Snackbarrgh.error(message);
			isLoading.set(false);
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
			title: 'Are you sure?',
			text: 'You won\'t be able to revert this!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#c61e37',
			cancelButtonColor: '#838383',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				isLoading.set(true);
				repo.destroy(`${Api.PROVIDERS}/${id}`, (message) => {
					Snackbarrgh.error(message);
					load();
					isLoading.set(false);
				}, (message) => {
					Snackbarrgh.error(message);
					isLoading.set(false);
				});
			}
		});
	}

	async function save() {
		isLoading.set(true);
		if (formState.id != null) {
			repo.update(`${Api.PROVIDERS}/${formState.id}`, formState, (list) => {
				closeModal();
				load();
				isLoading.set(false);
			}, (message, e) => {
				errors = e;
				Snackbarrgh.error(message);
				isLoading.set(false);
			});
		} else {
			repo.store(`${Api.PROVIDERS}`, formState, (data) => {
				closeModal();
				load();
				isLoading.set(false);
			}, (message, e) => {
				errors = e;
				Snackbarrgh.error(message);
				isLoading.set(false);
			});
		}
	}

	function create() {
		openModal({});
	}
</script>

<Master>
	<div>
		<div class="d-flex justify-content-between align-items-center pt-4 pb-3">
			<div>
				<h6 class="m-0">Providers</h6>
				<p class="m-0 text-muted">ghjh</p>
			</div>
			<div>
				<button class="btn btn-primary d-flex align-items-center justify-content-center gap-1"
								on:click={() => create()}>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
							 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
							 class="feather feather-plus">
						<line x1="12" y1="5" x2="12" y2="19"></line>
						<line x1="5" y1="12" x2="19" y2="12"></line>
					</svg>
					Create
				</button>
			</div>
		</div>

		<div class="row">

			{#if !$isLoading && $providers.length === 0}
				<div class="text-center d-flex justify-content-center align-items-center flex-column">
					<img style="height: 25vh" src="illustrations/error.svg" />
					<h6 class="mt-3">Oops!</h6>
					<p class="my-0 text-muted">No providers available.</p>
				</div>
			{:else}
				{#each $providers as provider (provider.id)}
					<div class="col-md-2 ">
						<div class="card p-2 mt-2 position-relative">
							<div class="d-flex flex-column gap-2 align-items-end justify-content-end"
									 style="position: absolute;right: 0.5rem;">
								<button
									class="border-0 btn text-primary bg-transparent d-flex align-items-center justify-content-center p-0"
									on:click={() => openModal(provider)}>
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
											 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
											 class="feather feather-edit-3">
										<path d="M12 20h9"></path>
										<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
									</svg>
								</button>
								<button
									class="border-0 btn text-danger bg-transparent d-flex align-items-center justify-content-center p-0"
									on:click={() => deleteProvider(provider.id)}>
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
											 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
											 class="feather feather-trash-2">
										<polyline points="3 6 5 6 21 6"></polyline>
										<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
										<line x1="10" y1="11" x2="10" y2="17"></line>
										<line x1="14" y1="11" x2="14" y2="17"></line>
									</svg>
								</button>
							</div>
							<div class="provider-item pt-4">
								<div class="d-flex flex-column gap-1 justify-content-center align-items-center">
									<img src="{provider.logo_url}" height="80" width="80" class="object-fit-contain" alt="">
									<h6>{provider.name}</h6>
								</div>
							</div>
						</div>
					</div>
				{/each}
			{/if}
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
					<div class="modal-header position-relative justify-content-center pt-4">
						<h5 class="modal-title" id="editProviderModalLabel">Edit Provider</h5>
						<button on:click={()=>closeModal()} type="button"
										class="close position-absolute border-0 top-50 end-0 translate-middle"
										data-dismiss="modal" aria-label="Close" style="padding-bottom: 0.2rem">
							<span aria-hidden="true" class="m-0"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
																												viewBox="0 0 24 24" fill="none" stroke="currentColor"
																												stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
																												class="feather feather-x"><line x1="18" y1="6" x2="6"
																																												y2="18"></line><line x1="6"
																																																						 y1="6"
																																																						 x2="18"
																																																						 y2="18"></line></svg></span>
						</button>
					</div>
					<div class="modal-body">
						<form on:submit|preventDefault={save}>
							<div class="row py-3">
								<div class="col-md-6">
									<SkyTextInput placeholder="e.g. SKY" label="Code" id="code" bind:value={formState.code}
																errors={errors.code} type="text" />
								</div>
								<div class="col-md-6">
									<SkyTextInput placeholder="e.g. Sky Pay" label="Name" id="name" bind:value={formState.name}
																errors={errors.name} type="text" />
								</div>

								<div class="col-md-12">
									<SkyTextInput label="Description" id="description" bind:value={formState.description}
																errors={errors.description} type="textarea" />
								</div>
								<div class="col-md-12">
									<SkySelect placeholder="None" label="Integration Difficulty" id="integrationDifficulty"
														 bind:value={formState.integration_difficulty}
														 options={["Easy","Medium", "Hard"]} errors={errors.integration_difficulty} />
								</div>
								<div class="col-md-12">
									<SkyImageInput value="s" placeholder="None" label="Logo" id="image"
																 bind:input={formState.image} errors={errors.image} />
								</div>
								<div class="col-md-auto">
									<SkySwitch label="Active" id="active" bind:checked={formState.status} />
								</div>
								<div class="col-md-auto">
									<SkySwitch label="Featured" id="featured" bind:checked={formState.featured} />
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
