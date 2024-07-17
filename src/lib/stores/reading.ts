import { writable } from 'svelte/store';

import { Howl } from 'howler';

import type { Frame, Story, Variable } from '$lib/types';

export const storyStore = writable<Story>();
export const framesStore = writable<Frame[]>();
// export const progressStore = writable<IProgressData[]>();

export const fullscreenStore = writable<boolean>(false);

export const variablesStore = writable<Variable[]>([]);

const customSoundStore = () => {
	const { set, subscribe, update } = writable<{
		playing: boolean;
		sound: Howl | null;
		src: string;
	}>({
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
