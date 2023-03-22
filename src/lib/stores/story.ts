import { defaultColor } from '$lib/constants';
import type { RGB } from '$lib/types';
import { writable, type Writable } from 'svelte/store';

export const mainColor: Writable<RGB> = writable(defaultColor);
