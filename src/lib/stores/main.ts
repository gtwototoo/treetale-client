import { derived, writable } from 'svelte/store';

import type { RGB } from '$lib/types';

import { DEFAULT_COLOR } from '$lib/constants/colors';
import { contrastText } from '$lib/utils/contrast';

export const bodyColorStore = writable<RGB>(DEFAULT_COLOR);
export const redColorStore = derived([bodyColorStore], ([$bodyColorStore]) => {
	return contrastText($bodyColorStore) ? 'bg-red-900' : 'bg-red-100';
});
