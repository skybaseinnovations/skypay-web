<script>
    // Import your header and footer components
    import Header from './Header.svelte';
    import Footer from './Footer.svelte';
    import { isLoading } from '../stores';
  </script>
  
  <div class="site-container">
    <Header />
  
    <div class="content container">
      <!-- Your page content goes here -->
      <slot></slot>
    </div>
  
    <Footer />
    {#if $isLoading}
      <div class="loading-box">Loading...</div>
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
      background-color: rgba(0,0,0,0.75); /* Semi-transparent black */
      color: white; /* White text */
      padding: 8px 16px; /* Some padding */
      border-radius: 0 0 0 5px; /* Rounded bottom-left corner */
      font-size: 14px; /* Small and cute font size */
      z-index: 1000; /* Make sure it's above other content */
    }
  </style>