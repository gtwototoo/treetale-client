import type { IFrame, IVariable } from '$lib/types';

import type { IStoryFull } from '$lib/types/reading';
import { Howl } from 'howler';
import { writable } from 'svelte/store';

export const storyStore = writable<IStoryFull>();
export const framesStore = writable<Array<IFrame>>();
// export const progressStore = writable<Array<IProgressData>>();

export const fullscreenStore = writable<boolean>(false);

export const variablesStore = writable<Array<IVariable>>([]);

const customSoundStore = () => {
	const { subscribe, update, set } = writable<Howl>(null);

	const setSrc = (src: string) => {
		update((current) => {
			if (current) {
				current.stop();
				current.unload();
				current.off();
			}

			return src
				? new Howl({
						src,
						loop: true
				  })
				: null;
		});
	};

	return {
		subscribe,
		set,
		setSrc,
		update
	};
};

export const soundStore = customSoundStore();
