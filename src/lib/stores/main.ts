import { derived, writable } from 'svelte/store';

import { DEFAULT_COLOR } from '$lib/constants';
import type { TRGB } from '$lib/types';
import { contrastText } from '$lib/utils';

export const bodyColorStore = writable<TRGB>(DEFAULT_COLOR);
export const redColorStore = derived([bodyColorStore], ([$bodyColorStore]) => {
	return contrastText($bodyColorStore) ? 'bg-red-900' : 'bg-red-100';
});
