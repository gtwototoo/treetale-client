import { DEFAULT_COLOR } from '$lib/constants';
import type { RGB } from '$lib/types';
import { writable, type Writable } from 'svelte/store';

export const bodyColor: Writable<RGB> = writable(DEFAULT_COLOR);
