<script>
	export let label = '';
	export let id = '';
	export let value = ''; // Bindable value for the selected option
	export let errors = [];
	export let title = ''; // Title/tooltip text for additional information
	export let placeholder = '';
	export let options = []; // Array of strings for options
</script>

<div class="mb-2">
	<div class="d-flex justify-content-between">
		<label for={id} class="form-label">{label}</label>

		<div>
			{#if errors && errors.length}
				{#each errors as error}
					<div class="text-danger d-flex align-items-center gap-1">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
								 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
								 class="feather feather-alert-circle">
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="12" y1="8" x2="12" y2="12"></line>
							<line x1="12" y1="16" x2="12.01" y2="16"></line>
						</svg>{error}
					</div>
				{/each}
			{/if}
		</div>
	</div>

	<select class="form-select" id={id} bind:value={value} title={title}>
		{#if placeholder}
			<option value=null>{placeholder}</option>
		{/if}
		{#each options as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
</div>
