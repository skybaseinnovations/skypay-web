<script>
    // Import your header and footer components
    import Header from './Header.svelte';
    import Footer from './Footer.svelte';
    import { isLoading } from '../stores';
    import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
    import { onMount } from 'svelte';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import '/src/styles/global.css';

    var mounted = false;
    onMount(async()=>{
      mounted = true
    })

  </script>
  
  <div class="site-container">
    <Header />
  
    <div class="content container">
      <!-- Your page content goes here -->
      <slot></slot>
    </div>
  
    <Footer />
    {#if mounted}
    <!--{#if $isLoading}-->
      <div class="loading-box">
        <LottiePlayer
        src="loading.json"
        autoplay="{true}"
        loop="{true}"
        controls="{false}"
        renderer="svg"
        background="transparent"
        height="{32}"
        width="{32}"
      /></div>
    <!--{/if}-->
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
    .loading-box {
      position: fixed; /* Stick it on top right, no matter where you scroll */
      top: 0;
      right: 0;
      background-color: rgba(255, 255, 255);
      color: white; /* White text */
      padding: 8px 16px; /* Some padding */
      border-radius: 0 0 0 5px; /* Rounded bottom-left corner */
      font-size: 14px; /* Small and cute font size */
      z-index: 1000; /* Make sure it's above other content */
    }
  </style>