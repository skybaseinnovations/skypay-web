<script>
  // Import any necessary functions or stores
  import { isLoading, user } from '../stores';
  import { AuthRepo } from '../repo/AuthRepo';
  import Swal from 'sweetalert2';
  import { goto } from '$app/navigation';

  function logout(){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to access all features!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c61e37",
      cancelButtonColor: "#838383",
      confirmButtonText: "Yes!"
    }).then((result) => {
      if (result.isConfirmed) {
        let repo = new AuthRepo();
        repo.logout(()=>{
          goto('/logout')
        }, (message)=>{
          alert(message)
        })
      }
    });
  }
</script>

<nav class="header">
  <div class="logo">
    <a href="/">SKYPAY</a>
  </div>
  <ul class="nav-links">
    <li><a href="/">Home</a></li>
    <li><a href="/providers">Providers</a></li>
    {#if $user}
      <li>Welcome, {$user?.name}!</li>
      <li><a href="#" on:click="{()=>logout()}">Logout</a></li>
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
