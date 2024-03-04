<script>
	import 'bootstrap/dist/css/bootstrap.min.css';
	import { AuthRepo } from '../../repo/AuthRepo';
	import { goto } from '$app/navigation';
	import { isLoading } from '../../stores';
	import AuthMaster from '../../layouts/AuthMaster.svelte';

	let countryCode = '+977'; // Default country code
	let name = '';
	let email = '';
	let businessName = '';
	let businessType = '';
	let phone = '';
	let password = '';

	const countryCodes = [
		{ name: 'Nepal', code: '+977' },
		{ name: 'India', code: '+91' }
	];
	const businessTypes = ['Software', 'Hardware', 'Services', 'Consulting'];
	let errors = {};

	const defaultPattern = '{3,255}$';
	const passwordPattern = '.{8,}';

	function validateForm() {
		errors = {}; // Reset errors

		if (!name || name.length < 3 || name.length > 255) {
			errors.name = ['Name must be between 3 and 255 characters.'];
		}
		if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			errors.email = ['Invalid email format.'];
		}
		if (!password || password.length < 8) {
			errors.password = ['Password must be at least 8 characters.'];
		}
		if (!businessName || businessName.length < 3) {
			errors.businessName = ['Business name must be at least 3 characters.'];
		}
		if (!businessType || businessType.length < 3) {
			errors.businessType = ['Business type must be selected.'];
		}

		return Object.keys(errors).length === 0; // True if no errors
	}

	function signup() {
		if (validateForm()) {
			isLoading.set(true)
			let authRepo = new AuthRepo();
			authRepo.signup(email, password,`${countryCode} ${phone}`, name, businessType, businessName, function(user) {
				isLoading.set(false)
				goto('/home', { replaceState: true });
			}, function(message, e) {
				errors = e;
				isLoading.set(false)
				// toastr.error('I do not think that word means what you think it means.', 'Inconceivable!')
				alert(message); // Show error message
			});
		} else {
			console.log('Validation errors:', errors);
		}
	}
</script>

<AuthMaster>
	<div class="container">
		<h2>Sign Up</h2>
		<form on:submit|preventDefault={signup}>
			<div class="mb-3">
				<label for="nameInput" class="form-label">Name</label>
				<input
					type="text"
					class="form-control"
					id="nameInput"
					bind:value={name}
					title="Name must be at least  3 characters"
				>
				{#if errors.name}
					{#each errors.name as error}
						<div class="text-danger">{error}</div>
					{/each}
				{/if}
			</div>

			<div class="mb-3">
				<label for="emailInput" class="form-label">Email Address</label>
				<input type="email" class="form-control" id="emailInput" bind:value={email} required title="Please enter a valid email address.">
				{#if errors.email}
					{#each errors.email as error}
						<div class="text-danger">{error}</div>
					{/each}
				{/if}
			</div>

			<div class="mb-3">
				<label for="passwordInput" class="form-label">Password</label>
				<input type="password" class="form-control" id="passwordInput" bind:value={password} required title="Password must be at least 8 characters.">
				{#if errors.password}
					{#each errors.password as error}
						<div class="text-danger">{error}</div>
					{/each}
				{/if}
			</div>

			<div class="mb-3">
				<label for="businessNameInput" class="form-label">Business Name</label>
				<input type="text" class="form-control" id="businessNameInput" bind:value={businessName} required title="Business name must be at least 3 characters.">
				{#if errors.businessName}
					{#each errors.businessName as error}
						<div class="text-danger">{error}</div>
					{/each}
				{/if}
			</div>

			<div class="mb-3">
				<label for="businessTypeSelect" class="form-label">Business Type</label>
				<select class="form-select" id="businessTypeSelect" bind:value={businessType} required title="Please select a business type.">
					<option value="">Select your business type</option>
					{#each businessTypes as type}
						<option value={type}>{type}</option>
					{/each}
				</select>
				{#if errors.businessType}
					{#each errors.businessType as error}
						<div class="text-danger">{error}</div>
					{/each}
				{/if}
			</div>

			<div class="mb-3">
				<label for="phoneInput" class="form-label">Phone</label>
				<div class="input-group">
					<select class="form-select" bind:value={countryCode}>
						{#each countryCodes as country}
							<option value={country.code}>{country.name} ({country.code})</option>
						{/each}
					</select>
					<input type="tel" class="form-control" id="phoneInput" bind:value={phone} required title="Please enter a valid phone number.">
				</div>
				{#if errors.phone}
					{#each errors.phone as error}
						<div class="text-danger">{error}</div>
					{/each}
				{/if}
			</div>

			<button type="submit" class="btn btn-primary">Sign Up</button>
		</form>
	</div>
</AuthMaster>
