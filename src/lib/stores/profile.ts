import type { IUser, TRGB } from '$lib/types';
import type { IStoryFull } from '$lib/types/reading';
import { writable } from 'svelte/store';

export const storiesStore = writable<IStoryFull[]>([]);
export const userStore = writable<IUser>();
export const colorStore = writable<TRGB>();
