<script>
    // @ts-ignore
    import { isLoading, payments } from '../stores';
    import { onMount } from 'svelte';
    import { GenericRepo } from '../repo/GenericRepo';
    import { Api } from '../utils/Api';
    import Master from '../layouts/Master.svelte';
    // @ts-ignore
    import Swal from 'sweetalert2';
    import { Snackbarrgh } from '../utils/Snackbarrgh';
    import { writable } from 'svelte/store';

    let repo = new GenericRepo();
    let dashboardData = writable({}); // Initialize with an empty object

    // Load payments list
    function load() {
        isLoading.set(true);
        repo.list(
            Api.DASHBOARD,
            // @ts-ignore
            null,
            (dataX) => {
                isLoading.set(false);
                // @ts-ignore
                dashboardData.set(dataX);
            },
            (message) => {
                Snackbarrgh.error(message);
                isLoading.set(false);
            }
        );
    }

    onMount(load);
</script>

<Master>
    <div>
        <div class="d-flex justify-content-between align-items-center pt-4 pb-3">
            <div>
                <h6 class="m-0">Dashboard</h6>
                <p class="m-0 text-muted">ghjh</p>
            </div>
            <div></div>
        </div>

        <div class="row">
            {#if $dashboardData}
                <p>Total Payments: {$dashboardData.totalPayments}</p>
                <p>Cancelled Payments: {$dashboardData.cancelledCount}</p>
                <p>Success Payments: {$dashboardData.successCount}</p>
                <p>Invalid Payments: {$dashboardData.invalidCount}</p>
            {/if}
        </div>
    </div>
</Master>
