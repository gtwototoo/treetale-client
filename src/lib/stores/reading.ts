import { writable } from 'svelte/store';

import { Howl } from 'howler';

import type { IFrame, IVariable } from '$lib/types';
import type { IStoryFull } from '$lib/types/reading';

export const storyStore = writable<IStoryFull>();
export const framesStore = writable<Array<IFrame>>();
// export const progressStore = writable<Array<IProgressData>>();

export const fullscreenStore = writable<boolean>(false);

export const variablesStore = writable<Array<IVariable>>([]);

const customSoundStore = () => {
	const { set, subscribe, update } = writable<Howl>(null);

	const setSrc = (src: string) => {
		update((current) => {
			if (current) {
				current.stop();
				current.unload();
				current.off();
			}

			return src
				? new Howl({
						loop: true,
						src
				  })
				: null;
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
