<script>
	export let label = '';
	export let id = '';
	export let errors = [];
</script>

<div class="d-flex justify-content-between">
	<label for={id} class="form-label">{label}</label>
	<!-- Error Display Logic -->
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
