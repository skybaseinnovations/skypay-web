<script>
	export let label = '';
	export let id = '';
	export let checked = false; // Bindable boolean value for the switch state
</script>

<div class="form-check form-switch d-flex align-items-center gap-2">
	<input type="checkbox" class="form-check-input" role="switch" id={id}
				 bind:checked={checked}>
	<label class="custom-control-label" for="featured">{label}</label>
</div>