<script>
	// Import your header and footer components
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import { onMount } from 'svelte';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import '/src/styles/global.css';
	import { user, token, isLoading } from '../stores';
	var mounted = false;
	onMount(async () => {
		mounted = true;
	});
</script>

<div class="site-container">

	<div class="content">
		<!-- Your page content goes here -->
		<slot></slot>
	</div>

	{#if mounted}
		{#if $isLoading}
			<div class="loading-overlay"></div>
			<div class="loading-box">
				<LottiePlayer
					src="loading.json"
					autoplay="{true}"
					loop="{true}"
					controls="{false}"
					renderer="svg"
					background="transparent"
					height="{64}"
					width="{64}"
				/>
				<p class="text-dark text-center m-0">Loading</p>
			</div>
		{/if}
	{/if}
</div>

<style>
    .site-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .content {
        flex: 1;
        /* Ensure content takes up the available space, pushing the footer down */
    }
</style>