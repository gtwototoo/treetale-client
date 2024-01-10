import type { IStory, IVariable } from '$lib/types';

import type { INote } from '$lib/types/editing';
import { writable } from 'svelte/store';

export const informationDataStore = writable<IStory>();
export const stateAreaStore = writable<'await' | 'saved' | 'error' | 'saving'>('await');
export const variablesStore = writable<Array<IVariable>>([]);
export const notesStore = writable<Array<INote>>([]);

export const readonlyStore = writable<boolean>(false);
