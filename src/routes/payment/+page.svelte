<script>
	import { onMount } from 'svelte';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import { AuthRepo } from '../../repo/AuthRepo';
	import { user, isLoading, token } from '../../stores';
	import { goto } from '$app/navigation';
	import AuthMaster from '../../layouts/AuthMaster.svelte';
	import Swal from 'sweetalert2';
	import { Snackbarrgh } from '../../utils/Snackbarrgh.js';
	import SkyTextInput from '../../components/SkyTextInput.svelte';
	import SkySelect from '../../components/SkySelect.svelte';
	import SkySwitch from '../../components/SkySwitch.svelte';


</script>

<AuthMaster>
	<div class={'modal d-block'}
			 tabindex="-1"
			 role="dialog" aria-labelledby="editProviderModalLabel" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header position-relative justify-content-center pt-4">
					<h5 class="modal-title" id="editProviderModalLabel">Add Payment Option</h5>
					<button type="button" class="close position-absolute border-0 top-50 end-0 translate-middle"
									data-dismiss="modal" aria-label="Close" style="padding-bottom: 0.2rem">
							<span aria-hidden="true" class="m-0"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
																												viewBox="0 0 24 24" fill="none" stroke="currentColor"
																												stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
																												class="feather feather-x"><line x1="18" y1="6" x2="6"
																																												y2="18"></line><line x1="6"
																																																						 y1="6"
																																																						 x2="18"
																																																						 y2="18"></line></svg></span>
					</button>
				</div>
				<div class="modal-body">
					<form>
						<div>
							<h5 class="m-0">Integration Method *
								<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
										 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
										 class="feather feather-alert-circle">
									<circle cx="12" cy="12" r="10"></circle>
									<line x1="12" y1="8" x2="12" y2="12"></line>
									<line x1="12" y1="16" x2="12.01" y2="16"></line>
								</svg>
							</h5>
							<p class="text-muted m-0">If you need more info, Please <a href="#" class="links">Click Here</a></p>
						</div>
						<div>
							<ul class="nav nav-pills mb-3 w-100 mt-3" id="pills-tab" role="tablist">
								<li class="nav-item w-50" role="presentation">
									<button class="nav-link active w-100" id="pills-manual-tab" data-bs-toggle="pill" data-bs-target="#pills-manual"
													type="button" role="tab" aria-controls="pills-manual" aria-selected="true">Manual
									</button>
								</li>
								<li class="nav-item w-50" role="presentation">
									<button class="nav-link w-100" id="pills-api-tab" data-bs-toggle="pill" data-bs-target="#pills-api"
													type="button" role="tab" aria-controls="pills-api" aria-selected="false">API
									</button>
								</li>
							</ul>
							<div class="tab-content" id="pills-tabContent">
								<div class="tab-pane fade show active" id="pills-manual" role="tabpanel" aria-labelledby="pills-manual-tab"
										 tabindex="0">
									<form>
										<div>
											<label for="">Payment Provider *</label>
											<div class="d-flex justify-content-between dashed-border py-3 px-4 mt-3">
												<div class="d-flex gap-2">
													<label for="fonepay">Fonepay</label>
													<img src="" width="24" height="24" class="object-fit-contain" alt="">
													<div class="badge lh-base">No transaction Fees</div>
												</div>
												<input type="radio" class="form-check-input" id="fonepay">
											</div>
											<div class="d-flex justify-content-between dashed-border py-3 px-4 mt-3">
												<div class="d-flex gap-2">
													<label for="fonepay">Fonepay</label>
													<img src="" width="24" height="24" class="object-fit-contain" alt="">
													<div class="badge lh-base">No transaction Fees</div>
												</div>
												<input type="radio" class="form-check-input" id="fonepay">
											</div>
										</div>
										<div class="row">
											<div class="col-md-4 pt-3">
                         <label for="">OR Code</label>
											</div>
											<div class="col-md-8">
												<div class="col-md-12 pt-3">
													<SkyTextInput label="Account Name" id="acc_name" placeholder="Account Name"
																			 type="text" />
												</div>
												<div class="col-md-12 pt-1">
													<SkyTextInput label="Account Number" id="acc_number" placeholder="Account Number"
																				type="text" />
												</div>
												<div class="col-md-12 pt-1">
													<SkyTextInput label="Account Details/Remarks" id="acc_details" placeholder="Account Details"
																				type="text" />
												</div>

											</div>
											<div class="col-12 pt-3">
												<SkyTextInput label="Note" id="note"
																			type="text" />
											</div>
										</div>
									</form>
								</div>
								<div class="tab-pane fade" id="pills-api" role="tabpanel" aria-labelledby="pills-api-tab"
										 tabindex="0">
									<form>
										<div>
											<label for="">Payment Provider *</label>
											<div class="d-flex justify-content-between dashed-border py-3 px-4 mt-3">
												<div class="d-flex gap-2">
													<label for="fonepay">Fonepay</label>
													<img src="" width="24" height="24" class="object-fit-contain" alt="">
													<div class="badge lh-base">No transaction Fees</div>
												</div>
												<input type="radio" class="form-check-input" id="fonepay">
											</div>
											<div class="d-flex justify-content-between dashed-border py-3 px-4 mt-3">
												<div class="d-flex gap-2">
													<label for="fonepay">Fonepay</label>
													<img src="" width="24" height="24" class="object-fit-contain" alt="">
													<div class="badge lh-base">No transaction Fees</div>
												</div>
												<input type="radio" class="form-check-input" id="fonepay">
											</div>
										</div>
										<div class="pt-3">
											<SkyTextInput label="Environment *" id="env"
																		type="text" />
										</div>
										<div class="pt-3">
											<SkyTextInput label="Secret Key/Code *" id="secret_key"
																		type="text" />
										</div>
										<div class="pt-3">
												<SkyTextInput label="Note" id="note"
																			type="text" />
										</div>
									</form>
								</div>
							</div>
						</div>
						<div class="modal-footer mt-4">
							{#if $isLoading}
								<p>Loading..</p>
							{:else}
								<button on:click={()=>closeModal()} type="button" class="btn btn-secondary" data-dismiss="modal">Close
								</button>
								<button on:click={()=>save()} type="submit" class="btn btn-primary">Save</button>
							{/if}
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</AuthMaster>
