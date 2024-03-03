<script>
	import { onMount } from 'svelte';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import { AuthRepo } from '../../repo/AuthRepo';
	import { user } from '../../stores';

	let email = '';
	let password = '';

	function signin(){
		let authRepo = new AuthRepo();
		authRepo.login(email, password, function(user) {
			// Close modal programmatically if needed, or navigate to another page
			alert(`Welcome, ${user.name}!`); // Welcome message
		}, function(message) {
			alert(message); // Show error message
		});
	}
</script>

<!-- Login Screen wrapped in a Modal for neat presentation -->
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="exampleModalLabel">Login</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
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
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>