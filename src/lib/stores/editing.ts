import { writable } from 'svelte/store';

import { Howl } from 'howler';

import type { IStory, IVariable } from '$lib/types';
import type { INote } from '$lib/types/editing';

export const informationDataStore = writable<IStory>();
export const stateAreaStore = writable<'await' | 'error' | 'saved' | 'saving'>('await');
export const variablesStore = writable<Array<IVariable>>([]);
export const notesStore = writable<Array<INote>>([]);

export const readonlyStore = writable<boolean>(false);

const customSoundStore = () => {
	const { set, subscribe, update } = writable<{ playing: boolean; sound: Howl; src: string }>({
		playing: false,
		sound: null,
		src: ''
	});

	const setSrc = (src: string) => {
		update((current) => {
			if (current.sound) {
				current.sound.stop();
				current.sound.unload();
				current.sound.off();
			}

			return {
				...current,
				sound: src
					? new Howl({
							loop: true,
							onplay: () => update((current) => ({ ...current, playing: true })),
							onstop: () => update((current) => ({ ...current, playing: false })),
							src
						})
					: null
			};
		});
	};

	return {
		set,
		setSrc,
		subscribe,
		update
	};
};

export const soundStore = customSoundStore();
