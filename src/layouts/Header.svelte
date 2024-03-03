<script>
  // Import any necessary functions or stores
  import { user } from '../stores';
</script>

<nav class="header">
  <div class="logo">
    <a href="/">SKYPAY</a>
  </div>
  <ul class="nav-links">
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/services">Services</a></li>
    <li><a href="/contact">Contact</a></li>
    {#if $user}
      <li>Welcome, {$user?.name}!</li>
    {:else}
      <li><a href="/login">Login</a></li>
    {/if}
  </ul>
</nav>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #333;
    color: #fff;
  }
  .logo a {
    color: #fff;
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
  }
  .nav-links {
    list-style: none;
  }
  .nav-links li {
    display: inline;
    margin-left: 20px;
  }
  .nav-links li a {
    color: #fff;
    text-decoration: none;
    transition: color 0.3s ease-in-out;
  }
  .nav-links li a:hover {
    color: #ddd;
  }
</style>
