import type { IStory, IVariable } from '$lib/types';
import { writable } from 'svelte/store';

export const informationDataStore = writable<IStory>();
export const stateAreaStore = writable<'await' | 'saved' | 'error' | 'saving'>('await');
export const variablesStore = writable<IVariable[]>([]);
