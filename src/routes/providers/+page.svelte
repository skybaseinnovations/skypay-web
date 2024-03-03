<script>
	import { providers } from './../../stores.ts';
	import { onMount, } from 'svelte';
	import { GenericRepo } from './../../repo/GenericRepo.ts';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import { Api } from '../../utils/Api';
	import Master from '../../layouts/Master.svelte';
	import { writable } from 'svelte/store';

let showModal = writable(false);
// let showModal = writable(false);

	export let editingId = null;
	
	let formState = {
	  id: '',
	  name: '',
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
	  let repo = new GenericRepo();
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
    // editingProvider.set(provider);
    showModal.set(true);
  }

  function deleteProvider(id) {
    providers.update(all => all.filter(p => p.id !== id));
  }

  function handleSubmit() {
    // Logic to handle submission and update the providers store
    // $('#editProviderModal').modal('hide');
  }
  </script>
  
  <Master>
	<div class="container">
	  <div class="row">
		{#each $providers as provider (provider.id)}
		  <div class="provider-item">
			<p>{provider.name}</p>
			<button class="btn btn-primary" on:click={() => openModal(provider)}>Edit</button>
			<button class="btn btn-danger" on:click={() => deleteProvider(provider.id)}>Delete</button>
		  
			<button on:click={() => editingId = provider.id}>Edit</button>
			<button on:click={() => deleteProvider(provider.id)}>Delete</button>
		  </div>
		{/each}
	  </div>
	</div> 
	
	<!-- Modal -->
	<div class={ $showModal ? 'modal fade show d-block' : 'modal fade' } id="editProviderModal" tabindex="-1" role="dialog" aria-labelledby="editProviderModalLabel" aria-hidden="true">
		<div class="modal-dialog" role="document">
		  <div class="modal-content">
			<div class="modal-header">
			  <h5 class="modal-title" id="editProviderModalLabel">Edit Provider</h5>
			  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			  </button>
			</div>
			<div class="modal-body">
			  <form on:submit|preventDefault={handleSubmit}>
				<div class="form-group">
				  <label for="providerId">ID</label>
				  <input type="text" class="form-control" id="providerId" bind:value={formState.id} readonly>
				</div>
				<div class="form-group">
				  <label for="providerName">Name</label>
				  <input type="text" class="form-control" id="providerName" bind:value={formState.name}>
				</div>
				<div class="modal-footer">
				  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
				  <button type="submit" class="btn btn-primary">Save changes</button>
				</div>
			  </form>
			</div>
		  </div>
		</div>
	  </div>

	  <div class={ $showModal ? 'modal-backdrop fade show' : '' }></div>
  </Master>
  