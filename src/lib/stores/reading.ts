import type { IProgressData, IUser } from '$lib/types';
import type { IStoryFull } from '$lib/types/reading';
import { writable } from 'svelte/store';

export const storyStore = writable<IStoryFull>();
export const framesStore = writable<IUser>();
export const progressStore = writable<IProgressData[]>();
