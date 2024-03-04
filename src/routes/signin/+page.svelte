<script>
	import { onMount } from 'svelte';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import { AuthRepo } from '../../repo/AuthRepo';
	import { user, isLoading, token } from '../../stores';
	import { goto } from '$app/navigation';
	import AuthMaster from '../../layouts/AuthMaster.svelte';

	export let data;
	let email = 'user1@test.test';
	let password = '12345678';
	let dataX = {};
	onMount(() => {
		isLoading.set(true);
		const storedUser = localStorage.getItem('user');
		const storedToken = localStorage.getItem('token');
		if (storedUser && storedToken) {
			isLoading.set(false);
			// goto('/home');
		}
		isLoading.set(false);
	});

	function signin() {
		isLoading.set(true);
		let authRepo = new AuthRepo();
		authRepo.login(email, password, function(userData) {
			isLoading.set(false);
			goto('home', { replaceState: true });
		}, function(message) {
			isLoading.set(false);
			alert(message); // Show error message
		});
	}
</script>

<AuthMaster>
	<div class="container">
		<form on:submit|preventDefault={signin}>
			<div class="mb-3">
				<label for="emailInput" class="form-label">Email address</label>
				<input type="email" class="form-control" id="emailInput" bind:value={email} placeholder="name@example.com">
			</div>
			<div class="mb-3">
				<label for="passwordInput" class="form-label">Password</label>
				<input type="password" class="form-control" id="passwordInput" bind:value={password} placeholder="Password">
			</div>
			<button type="submit" class="btn btn-primary">Sign In</button>
			<a href="/signup">Don't have an account? <b>Sign Up</b></a>
		</form>
	</div>
</AuthMaster>
