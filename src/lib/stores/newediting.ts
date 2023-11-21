import { writable } from 'svelte/store';

import type { IStory, IVariable } from '$lib/types';

export const informationDataStore = writable<IStory>();
export const stateAreaStore = writable<'await' | 'saved' | 'error' | 'saving'>('await');
export const variablesStore = writable<Array<IVariable>>([]);
