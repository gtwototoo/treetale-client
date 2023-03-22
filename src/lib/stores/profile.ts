import { writable } from '$lib/stores/sandboxStore';
import type { IUser } from '$lib/types';
import type { IStoryFull } from '$lib/types/reading';
import type { Writable } from 'svelte/store';

export const storiesStore: Writable<IStoryFull[]> = writable([]);
export const userStore: Writable<IUser> = writable();
