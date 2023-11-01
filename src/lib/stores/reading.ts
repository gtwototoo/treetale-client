import type { IFrame, IVariable } from '$lib/types';
import type { IStoryFull } from '$lib/types/reading';
import { writable } from 'svelte/store';

export const storyStore = writable<IStoryFull>();
export const framesStore = writable<Array<IFrame>>();
// export const progressStore = writable<Array<IProgressData>>();

export const variablesStore = writable<Array<IVariable>>([]);
