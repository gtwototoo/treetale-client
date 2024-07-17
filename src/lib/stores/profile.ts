import { writable } from 'svelte/store';

import type { RGB, Story, User } from '$lib/types';

export const storiesStore = writable<Story[]>([]);
export const userStore = writable<User>();
export const colorStore = writable<RGB>();
