import type { IStory, IVariable } from '$lib/types';
import type { IFrameCreate } from '$lib/types/editing';
import { writable } from 'svelte/store';

export const informationDataStore = writable<IStory>();

export const stateAreaStore = writable<'await' | 'saved' | 'error' | 'saving'>('await');

export const panelFrameStore = writable<IFrameCreate>();
export const variablesStore = writable<IVariable[]>([]);
