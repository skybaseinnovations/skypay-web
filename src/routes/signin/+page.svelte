<script>
	import { onMount } from 'svelte';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import { AuthRepo } from '../../repo/AuthRepo';
	import { user, isLoading, token } from '../../stores';
	import { goto } from '$app/navigation';
	import AuthMaster from '../../layouts/AuthMaster.svelte';
	import Swal from 'sweetalert2';

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
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: message,
			});
		});
	}
</script>

<AuthMaster>
	<div class="">
		<div class="row">
			<div class="col-md-6 h-full bg-black">


			</div>
			<div class="col-md-6 h-full d-flex flex-column justify-content-center align-items-center">
				<div class="text-center">
					<img src="/logo.svg" alt="" width="220">
					<h5>Sign In</h5>
					<p class="text-muted">to your merchant account</p>
				</div>
				<form class="form" on:submit|preventDefault={signin}>
					<div class="mb-3">
						<label for="emailInput" class="form-label">Email address</label>
						<input type="email" class="form-control" id="emailInput" bind:value={email} placeholder="name@example.com">
					</div>
					<div class="mb-3">
						<label for="passwordInput" class="form-label">Password</label>
						<input type="password" class="form-control" id="passwordInput" bind:value={password} placeholder="Password">
					</div>
					<div class="text-center">
						<button type="submit" class="btn btn-primary w-100">Sign In</button>
					</div>
					<div class="pt-2 text-center">
						<a href="/signup">Don't have an account? <b>Sign Up</b></a>
					</div>
				</form>
			</div>
		</div>
	</div>
</AuthMaster>
