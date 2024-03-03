<script>
    // Import your header and footer components
    import Header from './Header.svelte';
    import Footer from './Footer.svelte';
  </script>
  
  <div class="site-container">
    <Header />
  
    <div class="content container">
      <!-- Your page content goes here -->
      <slot></slot>
    </div>
  
    <Footer />
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