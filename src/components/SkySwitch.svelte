<script>
	import { createEventDispatcher } from 'svelte';
	export let label = '';
	export let id = '';
	export let checked = false; // Bindable boolean value for the switch state
	const dispatch = createEventDispatcher();

	function handleChange(event) {
		// Dispatch a custom event named 'change' with the original event object
		dispatch('change', { checked: event.target.checked });
	}
</script>

<div class="form-check form-switch d-flex align-items-center gap-2">
	<input type="checkbox" class="form-check-input" role="switch" id={id}
				 bind:checked={checked} on:change={handleChange}>
	<label class="custom-control-label" for="featured">{label}</label>
</div>