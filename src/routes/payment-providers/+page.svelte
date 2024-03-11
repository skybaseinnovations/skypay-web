<script>
	import { isLoading, paymentProviders, providers } from './../../stores';
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
	import SkyErrorText from '../../components/SkyErrorText.svelte';

	let showModal = writable(false);
	let apiMode = 'Manual';
	let repo = new GenericRepo();
	export let editingId = null;
	let apiConfiguration = {
		'environment': '',
		'secret': ''
	};
	let manualConfiguration = {
		'account_name': '',
		'account_number': '',
		'account_details': ''
	};
	const emptyData = {
		'id': null,
		'provider_id': '',
		'provider_name': '',
		'provider_logo_url': '',
		'manual_configuration': manualConfiguration,
		'api_configuration': apiConfiguration,
		'assisted_configuration': null,
		'notes': '',
		'mode': 'Manual',
		'alias_name': '',
		'order': 0,
		'is_default': false,
		'status': true,
		'created_at': ''
	};
	let data = emptyData;


	let errors = {};

	function updateMode(mode) {
		apiMode = mode;
	}

	// Reactive statement for editing logic
	$: if (editingId) {
		const itemToEdit = $paymentProviders.find(item => item.id === editingId);
		if (itemToEdit) {
			// formState = null;
			data = itemToEdit;
			if(data.manual_configuration !=null){
				manualConfiguration = data.manual_configuration;
			}
			if(data.api_configuration !=null){
				apiConfiguration = data.api_configuration;
			}
		}
	}

	// Load paymentProviders list

	function loadProviders() {
		isLoading.set(true);
		repo.list(Api.PROVIDERS, null, (list) => {
			providers.set(list);
			isLoading.set(false);
		}, (message) => {
			Snackbarrgh.error(message);
			isLoading.set(false);
		});
	}

	function load() {
		isLoading.set(true);
		loadProviders();
		repo.list(Api.PAYMENT_PROVIDERS, null, (list) => {
			paymentProviders.set(list);
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
	// 	paymentProviders.update(current => {
	// 	  return current.map(provider => provider.id === editingId ? formState : provider);
	// 	});
	//   } else {
	// 	paymentProviders.update(current => [...current, { ...formState, id: Date.now().toString() }]);
	//   }
	//   // Reset formState and editingId after submission
	//   formState = { name: '', /* reset other fields */ };
	//   editingId = null;
	// }

	// Function to delete a provider
	function openModal(provider) {
		if(provider !=null){
			editingId = provider.id
		}else{
			editingId = null;
			data = emptyData;
		}
		showModal.set(true);
	}

	function closeModal() {
		showModal.set(false);
	}

	function deleteItem(id) {
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
				repo.destroy(`${Api.PAYMENT_PROVIDERS}/${id}`, (message) => {
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
		//prepare data
		data.mode = apiMode;
		data['api_configuration'] = apiConfiguration;
		data['manual_configuration'] = manualConfiguration;

		isLoading.set(true);
		if (data.id != null) {
			repo.update(`${Api.PAYMENT_PROVIDERS}/${data.id}`, data, (list) => {
				closeModal();
				load();
				isLoading.set(false);
			}, (message, e) => {
				errors = e;
				Snackbarrgh.error(message);
				isLoading.set(false);
			});
		} else {
			repo.store(`${Api.PAYMENT_PROVIDERS}`, data, (data) => {
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
		openModal(null);
	}

	function handleStatusChange(event, provider) {
		const isChecked = event.detail.checked;
		provider.status = isChecked;
		updateProviderStatus(provider);
	}

	function updateProviderStatus(provider) {
		isLoading.set(true);
		repo.update(`${Api.PAYMENT_PROVIDERS}/${provider.id}`, {
			'status': provider.status,
		}, (list) => {
			closeModal();
			load();
			isLoading.set(false);
		}, (message, e) => {
			errors = e;
			Snackbarrgh.error(message);
			isLoading.set(false);
		});
	}
</script>

<Master>
	<div>
		<div class="d-flex justify-content-between align-items-center pt-4 pb-3">
			<div>
				<h6 class="m-0">My Payment Providers</h6>
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

			{#if !$isLoading && $paymentProviders.length === 0}
				<div class="text-center d-flex justify-content-center align-items-center flex-column">
					<img style="height: 25vh" src="illustrations/error.svg" />
					<h6 class="mt-3">Oops!</h6>
					<p class="my-0 text-muted">No payment providers available.</p>
				</div>
			{:else}
				{#each $paymentProviders as provider (provider.id)}
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
									on:click={() => deleteItem(provider.id)}>
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
									<img src="{provider.provider_logo_url}" height="80" width="80" class="object-fit-contain" alt="">
									<h6>{provider.provider_name} ({provider.mode})</h6>
									<SkySwitch label="Active" id="active" bind:checked={provider.status} on:change={(event) => handleStatusChange(event, provider)} />
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
		<div transition:fade={{ duration: 250 }} class={'modal d-block'}
				 tabindex="-1"
				 role="dialog" aria-labelledby="editProviderModalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header position-relative justify-content-center pt-4">
						<h5 class="modal-title" id="editProviderModalLabel">Add Payment Option</h5>
						<button on:click="{closeModal}" type="button" class="close position-absolute border-0 top-50 end-0 translate-middle"
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
						<form>

							<div>
								<h5 class="m-0">Integration Method *
									<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
											 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
											 class="feather feather-alert-circle">
										<circle cx="12" cy="12" r="10"></circle>
										<line x1="12" y1="8" x2="12" y2="12"></line>
										<line x1="12" y1="16" x2="12.01" y2="16"></line>
									</svg>
								</h5>
								<p class="text-muted m-0">If you need more info, Please <a href="#" class="links">Click Here</a></p>
							</div>
							{#if data.id === null || data.id ===''}
								<div>
									<SkyTextInput bind:value={data.alias_name}
																label="Alias Name" id="" placeholder="e.g Office Account"
																type="text" />
									<ul class="nav nav-pills mb-3 w-100 mt-3" id="pills-tab" role="tablist">
										<li class="nav-item" role="presentation">
											<button on:click="{() => updateMode('Manual')}" class="nav-link active w-100"
															id="pills-manual-tab"
															data-bs-toggle="pill" data-bs-target="#pills-manual"
															type="button" role="tab" aria-controls="pills-manual" aria-selected="true">Manual
											</button>
										</li>
										<li class="nav-item" role="presentation">
											<button on:click="{() => updateMode('API')}" class="nav-link w-100" id="pills-api-tab"
															data-bs-toggle="pill" data-bs-target="#pills-api"
															type="button" role="tab" aria-controls="pills-api" aria-selected="false">API
											</button>
										</li>
										<li class="nav-item" role="presentation">
											<button on:click="{() => updateMode('Assisted')}" class="nav-link w-100" id="pills-assisted-tab"
															data-bs-toggle="pill" data-bs-target="#pills-assisted"
															type="button" role="tab" aria-controls="pills-assisted" aria-selected="false">Assisted
											</button>
										</li>
									</ul>
								</div>

								<div>
									<SkyErrorText label="Payment Provider" errors={errors.provider_id}></SkyErrorText>
									{#if !$isLoading && $providers.length === 0}
										<div class="text-center d-flex justify-content-center align-items-center flex-column">
											<img style="height: 25vh" src="illustrations/error.svg" />
											<h6 class="mt-3">Oops!</h6>
											<p class="my-0 text-muted">No providers available.</p>
										</div>
									{:else}
										<div class="row">
											{#each $providers as provider (provider.id)}
												<div class="col-md-6">
													<label for="{provider.id}"
																 class="d-flex justify-content-between dashed-border {data.provider_id === provider.id ? 'active' : ''} py-3 px-4 mt-3"
																 style="cursor: pointer;">
														<div class="d-flex gap-2">
															<img src="{provider.logo_url}" width="24" height="24" class="object-fit-contain"
																	 alt="{provider.name}">
															<span>{provider.name}</span>
															<div class="badge lh-base">No transaction Fees 🎉</div>
														</div>
														<input bind:group={data.provider_id} name="provider_id" type="radio"
																	 class="form-check-input" id="{provider.id}" value="{provider.id}">
													</label>
												</div>
											{/each}
										</div>
									{/if}

								</div>

								<div class="my-2">
									<hr>
								</div>
							{/if}
							<div>
								<div class="tab-content" id="pills-tabContent">
									{#if apiMode === 'Manual'}
										<div class="row">
											<div class="col-md-4 pt-3">
												<label for="">OR Code</label>
											</div>
											<div class="col-md-8">
												<div class="col-md-12 pt-3">
													<SkyTextInput bind:value={manualConfiguration.account_name}
																				errors={errors?.['manual_configuration.account_name']??[]} label="Account Name"
																				id="manual_configuration.account_name"
																				placeholder="Account Name"
																				type="text" />
												</div>
												<div class="col-md-12 pt-1">
													<SkyTextInput bind:value={manualConfiguration.account_number}
																				errors={errors?.['manual_configuration.account_number']??[]}
																				label="Account Number" id="acc_number" placeholder="Account Number"
																				type="text" />
												</div>
												<div class="col-md-12 pt-1">
													<SkyTextInput bind:value={manualConfiguration.account_details}
																				errors={errors?.['manual_configuration.account_details']??[]}
																				label="Account Details" id="acc_details" placeholder="Account Details"
																				type="text" />
												</div>
											</div>

										</div>
									{:else if apiMode === 'API'}
										<div>
											<div class="pt-2">
												<SkyErrorText label="Environment"
																			errors={errors?.['api_configuration.environment']??[]}></SkyErrorText>
												<label class="radio-option">
													<input type="radio" bind:group={apiConfiguration.environment} value="UAT">
													UAT
												</label>

												<label class="radio-option">
													<input type="radio" bind:group={apiConfiguration.environment} value="LIVE">
													LIVE
												</label>
											</div>
											<div class="pt-3">
												<SkyTextInput errors={errors?.['api_configuration.secret'] ?? []}
																			bind:value={apiConfiguration.secret} label="Secret Key/Code *"
																			id="secret_key"
																			type="text" />
											</div>
										</div>
									{:else if apiMode === 'Assisted'}
										<p>Wow! you are one of the early users!</p>
									{/if}

									<div class="col-12 pt-3">
										<SkyTextInput errors="{errors.notes}" bind:value={data.notes} label="Notes (if any)" id="note"
																	type="text" />
									</div>
								</div>
								<div class="modal-footer mt-4">
									{#if $isLoading}
										<p>Loading..</p>
									{:else}
										<button on:click={()=>closeModal()} type="button" class="btn btn-secondary" data-dismiss="modal">
											Close
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
