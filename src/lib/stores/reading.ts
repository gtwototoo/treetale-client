import type { IProgressData, IUser } from '$lib/types';
import type { IStoryFull } from '$lib/types/reading';
import { writable, type Writable } from 'svelte/store';

export const infoStore: Writable<IStoryFull> = writable();
export const framesStore: Writable<IUser> = writable();
export const progressStore: Writable<IProgressData[]> = writable();
