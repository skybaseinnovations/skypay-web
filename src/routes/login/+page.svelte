<script>
	import { onMount } from 'svelte';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import { AuthRepo } from '../../repo/AuthRepo.ts';
	onMount(() => {

	});


	function signin(){
		let authRepo = new AuthRepo();
		authRepo.login("sonaamx","12345678", function(user) {
			alert(user.name)
		}, function(message) {
			alert(message)
		})
	}
</script>

<div class="container">
	<div class="row">
		<div class="col-sm">
			One of three columns
		</div>
		<div class="col-sm">
			Two of three columns
		</div>
		<div class="col-sm">
			Three of three columns
		</div>
	</div>
</div>

<!-- Modal Trigger Button -->
<button on:click={signin} type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
	Launch demo modal
</button>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				Your awesome content goes here. 🚀
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary">Save changes</button>
			</div>
		</div>
	</div>
</div>

