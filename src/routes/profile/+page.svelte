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
			text: "Are you sure you want to generate a new API key? This action will invalidate the old key, and you won't be able to revert it.",
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
		<div>
			<img src="{$user?.avatar_url}"/>
			<p>Name: {$user?.name}</p>
			<p>Email: {$user?.email}</p>
			<p>Phone: {$user?.phone}</p>
			<p>API Key: {$user?.api_key ?? 'Not set. Please contact admin'}</p>
			<hr>
			<div class="row">
				<p>Check Sample Payment</p>
				<a target="_blank" href="checkout?api_key={$user?.api_key}&amount=220">Pay Rs. 10 with SkyPay</a>
			</div>
			<hr>
		</div>
	</div>

	<div class="container">
        <div>
            <form on:submit={updateProfile}>
                <!-- <p>Name: <input type="text" name="name" value={$profile.name}></p>
                <p>Email: <input type="email" name="email" value={$profile.email}></p>
                <p>Phone: <input type="tel" name="phone" value={$profile.phone}></p> -->
                <p>Profile Picture: 
                    <input type="file" name="image" accept="image/*" onchange={uploadImage}>
                </p>
                <button type="submit">Update Profile</button>
            </form>
            <button on:click={generateApiKey}>Generate New API Key</button>
        </div>
    </div>
</Master>
