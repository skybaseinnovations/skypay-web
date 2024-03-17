// src/stores.js
import { writable } from 'svelte/store';

export const selectedProvider = writable(null);
export const providers = writable([]);
export const activePayment = writable(null);
export const isLoading = writable(false);