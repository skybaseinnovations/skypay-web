<script>
	import { isLoading, providers, user } from './../../stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Master from '../../layouts/Master.svelte';
	import { AuthRepo } from '../../repo/AuthRepo';
	import { Api } from '../../utils/Api';
	// @ts-ignore
	import Swal from 'sweetalert2';
	import { Snackbarrgh } from '../../utils/Snackbarrgh';

	let repo = new AuthRepo();
	let profile = writable({});

	// Load payments list
	function generateApiKey() {
		Swal.fire({
			title: 'Generate New API Key',
			text: 'Are you sure you want to generate a new API key? This action will invalidate the old key, and you won\'t be able to revert it.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#c61e37',
			cancelButtonColor: '#838383',
			confirmButtonText: 'Yes, generate new key'
		}).then((result) => {
			if (result.isConfirmed) {
				isLoading.set(true);
				repo.generateApiKey(
					(dataX) => {
						isLoading.set(false);
						Snackbarrgh.success('Successfully generated!');
					},
					(message) => {
						Snackbarrgh.error(message);
						isLoading.set(false);
					}
				);
			}
		});
	}

	// Handle image upload
	function uploadImage(event) {
		const file = event.target.files[0];
		// Implement logic to upload the image file and update the user's profile
		// Example: repo.uploadImage(file);
	}

	// Handle form submission to update user profile
	function updateProfile(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		isLoading.set(true);
		repo.updateUserProfile(formData,
			(dataX) => {
				isLoading.set(false);
				Snackbarrgh.success('Successfully generated!');
			},
			(message) => {
				Snackbarrgh.error(message);
				isLoading.set(false);
			}
		);
	}
</script>

<Master>
	<div class="container">
		<div class="row d-flex justify-content-center">
			<div class="col-md-4 col-sm-8 col-12 my-2">
				<div class="card p-3">
					<form on:submit={updateProfile}>
						<div>
							<div class="d-flex justify-content-center pb-4">
							 <span class="position-relative">
							    <img alt="" src="{$user?.avatar_url}" width="80" height="80" style="border-radius: 100%" />
								 <div class="position-absolute " style="bottom: -0.2rem;right: -0.2rem"><label for="update-image"
																																									 class="update-profile-label"><svg
									 xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512">
									 <path
										 d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
								 </svg>
								 </label>
									 <input type="file" class="d-none" name="image" accept="image/*" onchange={uploadImage}
													id="update-image">
								 </div>
							 </span>
							</div>
							<div class="form-floating mb-3">
								<input type="text" class="form-control" id="floatingInput" value="{$user?.name}">
								<label for="floatingInput" style="font-size: 0.8rem">Name</label>
							</div>
							<div class="form-floating mb-3">
								<input type="email" class="form-control" id="floatingInput" value=" {$user?.email}">
								<label for="floatingInput" style="font-size: 0.8rem">Email</label>
							</div>
							<div class="form-floating mb-3">
								<input type="tel" class="form-control" id="floatingInput" value="{$user?.phone}">
								<label for="floatingInput" style="font-size: 0.8rem">Phone</label>
							</div>
							<div class="position-relative">
								<div class="form-floating mb-3">
									<input type="email" class="form-control" id="floatingInput" readonly
												 value=" {$user?.api_key ?? 'Not set. Please contact admin'}">
									<label for="floatingInput" style="font-size: 0.8rem">API Key</label>
								</div>
								<button
									class="btn btn-primary position-absolute d-flex gap-1 align-items-center justify-content-center"
									style="padding: 0.1rem 0.5rem;font-size: 0.8rem;right: 0.3rem;top: 25%;"
									on:click={generateApiKey}>
									<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 512 512">
										<path
											d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H352c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32s-32 14.3-32 32v35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V432c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" />
									</svg>
									New
								</button>
							</div>
							<hr>
							<div class=" card">
								<label for="">Check Sample Payment</label>
								<a target="_blank" href="checkout?api_key={$user?.api_key}&amount=220">Pay Rs. 10 with SkyPay</a>
							</div>
							<hr>
						</div>


						<div class="d-flex justify-content-end">

							<button type="submit" class="btn btn-primary">Update Profile</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</Master>
