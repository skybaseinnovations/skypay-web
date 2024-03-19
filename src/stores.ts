// src/stores.js
import { writable } from 'svelte/store';
import type { Payment } from './models/core';

export const providers = writable([]);
export const payments = writable<Payment[]>([]);
export const paymentProviders = writable([]);
export const isLoading = writable(false);
export const user = writable(null);
export const token = writable(null);