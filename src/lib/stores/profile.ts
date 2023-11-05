import { writable } from 'svelte/store';

import type { IUser, TRGB } from '$lib/types';
import type { IStoryFull } from '$lib/types/reading';

export const storiesStore = writable<Array<IStoryFull>>([]);
export const userStore = writable<IUser>();
export const colorStore = writable<TRGB>();
