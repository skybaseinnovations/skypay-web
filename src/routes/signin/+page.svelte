<script>
	import { onMount } from 'svelte';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import { AuthRepo } from '../../repo/AuthRepo';
	import { user, isLoading, token } from '../../stores';
	import { goto } from '$app/navigation';
	import AuthMaster from '../../layouts/AuthMaster.svelte';
	import Swal from 'sweetalert2';
	import { Snackbarrgh } from '../../utils/Snackbarrgh.js';
	import SkyTextInput from '../../components/SkyTextInput.svelte';

	export let data;
	let email = 'user1@test.test';
	let password = '12345678';
	let errors = {};

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
			Snackbarrgh.success(`Welcome back, ${userData.name}`);
			goto('/', { replaceState: true });
		}, function(message) {
			isLoading.set(false);
			Snackbarrgh.error(message);
		});
	}
</script>

<AuthMaster>
	<div class="">
		<div class="row">
			<div class="col-md-6 h-full bg-signin text-center text-white p-5 gap-2">
				<img src="auth-screens.png" alt="" class="w-50">
				<h3>
					Unify Your Payments, Amplify Your Savings
				</h3>
				<p>
					Discover a smarter way to manage your merchant accounts. With our platform, one login gives you
					access to multiple payment platforms without the cost of transaction and API fees.
				</p>
			</div>
			<div class="col-md-6 h-full d-flex flex-column justify-content-center align-items-center">
				<div class="text-center">
					<img src="/logo.svg" alt="" width="220">
					<h5>Sign In</h5>
					<p class="text-muted">to your merchant account</p>
				</div>
				<form class="form" on:submit|preventDefault={signin}>
					<SkyTextInput label="Email Address" id="email" bind:value={email}
												errors={errors.email} type="email"
												title="Please enter a valid email address." />

					<SkyTextInput label="Password" id="password" bind:value={password}
												errors={errors.password} type="password"
												title="Password must be at least 8 characters." />
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
<style>
    .bg-signin {
        background: url(/auth-bg.png) no-repeat;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
</style>