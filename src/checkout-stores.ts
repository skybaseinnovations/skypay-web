// src/stores.js
import { writable } from 'svelte/store';
import type { Payment } from './models/core';

export const selectedProvider = writable(null);
export const providers = writable([]);
export const activePayment = writable<{}|null>(null);
export const isLoading = writable(false);
export const apiKey = writable<string|null>(null);