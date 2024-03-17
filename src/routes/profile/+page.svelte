<script>
	import { isLoading, providers, user } from './../../stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Master from '../../layouts/Master.svelte';
</script>

<Master>
	<div class="container">
		<div>
			<p>Name: {$user?.name}</p>
			<p>Email: {$user?.email}</p>
			<p>Phone: {$user?.phone}</p>
			<p>API Key: {$user?.api_key??"Not set. Please contact admin"}</p>
		</div>
	</div>
</Master>
