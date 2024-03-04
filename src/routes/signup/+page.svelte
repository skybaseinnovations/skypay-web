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

		// if (!name || name.length < 3 || name.length > 255) {
		// 	errors.name = ['Name must be between 3 and 255 characters.'];
		// }
		// if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
		// 	errors.email = ['Invalid email format.'];
		// }
		// if (!password || password.length < 8) {
		// 	errors.password = ['Password must be at least 8 characters.'];
		// }
		// if (!businessName || businessName.length < 3) {
		// 	errors.businessName = ['Business name must be at least 3 characters.'];
		// }
		// if (!businessType || businessType.length < 3) {
		// 	errors.businessType = ['Business type must be selected.'];
		// }

		return Object.keys(errors).length === 0; // True if no errors
	}

	function signup() {
		if (validateForm()) {
			isLoading.set(true);
			let authRepo = new AuthRepo();
			authRepo.signup(email, password, `${countryCode} ${phone}`, name, businessType, businessName, function(user) {
				isLoading.set(false);
				goto('/home', { replaceState: true });
			}, function(message, e) {
				errors = e;
				isLoading.set(false);
				// toastr.error('I do not think that word means what you think it means.', 'Inconceivable!')
				alert(message); // Show error message
			});
		} else {
			console.log('Validation errors:', errors);
		}
	}
</script>

<AuthMaster>
	<div class="">
		<div class="row">
			<div class="col-md-6 h-full bg-black">


			</div>
			<div class="col-md-6 d-flex flex-column justify-content-center align-items-center"
					 style="overflow-y: scroll;max-height: 100vh">
				<div style="padding: 5rem 1rem 4rem">
					<div class="text-center">
						<h4>Sign Up</h4>
						<p class="text-muted">Join Us and Forget About Transaction Fees.<br>
							It's that simple. 🚫💸👌
						</p>
					</div>
					<form class="form" on:submit|preventDefault={signup}>
						<div class="mb-2">
							<div class="d-flex justify-content-between">
								<label for="nameInput" class="form-label">Name</label>

								{#if errors.name}
									{#each errors.name as error}
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
							<input
								type="text"
								class="form-control"
								id="nameInput"
								bind:value={name}
								title="Name must be at least  3 characters"
							>

						</div>

						<div class="mb-2">
							<div class="d-flex justify-content-between">
								<label for="emailInput" class="form-label">Email Address</label>

								{#if errors.email}
									{#each errors.email as error}

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

							<input type="email" class="form-control" id="emailInput" bind:value={email}
										 title="Please enter a valid email address.">

						</div>

						<div class="mb-2">
							<div class="d-flex justify-content-between">
								<label for="passwordInput" class="form-label">Password</label>

								{#if errors.password}
									{#each errors.password as error}
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

							<input type="password" class="form-control" id="passwordInput" bind:value={password}
										 title="Password must be at least 8 characters.">

						</div>

						<div class="mb-2">
							<div class="d-flex justify-content-between">
								<label for="businessNameInput" class="form-label">Business Name</label>


								{#if errors.business_name}
									{#each errors.business_name as error}
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
							<input type="text" class="form-control" id="businessNameInput" bind:value={businessName}
										 title="Business name must be at least 3 characters.">

						</div>

						<div class="mb-2">
							<div class="d-flex justify-content-between">
								<label for="businessTypeSelect" class="form-label">Business Type</label>

								<div>
									{#if errors.business_type}
										{#each errors.business_type as error}
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
									{#if errors.phone}
										{#each errors.phone as error}
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


							<select class="form-select" id="businessTypeSelect" bind:value={businessType}
											title="Please select a business type.">
								<option value="">Select your business type</option>
								{#each businessTypes as type}
									<option value={type}>{type}</option>
								{/each}
							</select>

						</div>
						<div class="mb-2">
							<div class="d-flex justify-content-between">
								<label for="phoneInput" class="form-label">Phone</label>

								{#if errors.phone}
									{#each errors.phone as error}
										<div class="text-danger">{error}</div>
									{/each}
								{/if}
							</div>
							<div class="input-group ">
								<select class="form-select" bind:value={countryCode}>
									{#each countryCodes as country}
										<option value={country.code}>{country.name} ({country.code})</option>
									{/each}
								</select>
								<input type="tel" class="form-control" id="phoneInput" bind:value={phone}
											 title="Please enter a valid phone number.">
							</div>
						</div>
						<div class="form-group py-2">
							<div class="form-check form-switch d-flex align-items-center gap-2">
								<input type="checkbox" class="form-check-input" role="switch" id="terms">
								<label class="custom-control-label" for="terms">By signing up, I Agree to the <a href="#" class="links">Terms
									and conditions</a> .</label>
							</div>
						</div>
						<button type="submit" class="btn btn-primary w-100 mt-2">Sign Up</button>
						<div class="pt-2 text-center">
							<a href="/signup">Already have an Account? <b>Sign in</b></a>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>

</AuthMaster>
