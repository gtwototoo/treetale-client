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
