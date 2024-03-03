<script>
    import { writable } from 'svelte/store';
    import 'bootstrap/dist/css/bootstrap.min.css';

	import Master from '../../../layouts/Master.svelte';

    let provider = writable({
      code: "",
      name: "",
      status: false,
      description: "",
      website_url: "",
      documentation_url: "",
      support_email: "",
      region: "",
      integration_difficulty: "Medium", // Default selection
      signup_url: "",
      api_version: "",
      rating: null,
      featured: false
    });
</script>
<Master>
    <form class="container mt-4">
        <div class="form-group">
        <label for="code">Code</label>
        <input type="text" class="form-control" id="code" bind:value={$provider.code}>
        </div>
        
        <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" id="name" bind:value={$provider.name}>
        </div>
        
        <div class="form-group">
        <label for="status">Status</label>
        <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="status" bind:checked={$provider.status}>
            <label class="custom-control-label" for="status">Active</label>
        </div>
        </div>
        
        <div class="form-group">
        <label for="description">Description</label>
        <textarea class="form-control" id="description" bind:value={$provider.description}></textarea>
        </div>
        
        <div class="form-group">
        <label for="integrationDifficulty">Integration Difficulty</label>
        <select class="form-control" id="integrationDifficulty" bind:value={$provider.integration_difficulty}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
        </select>
        </div>
        
        <div class="form-group">
        <label for="featured">Featured</label>
        <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="featured" bind:checked={$provider.featured}>
            <label class="custom-control-label" for="featured">Yes</label>
        </div>
        </div>
        
        <!-- Add other fields as necessary -->
        
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</Master>
  <style>
    .container {
      max-width: 600px;
    }
  </style>
  