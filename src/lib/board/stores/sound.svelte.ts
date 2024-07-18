const getSoundStore = () => {
	let playing = $state(false);
	let sound = $state<Howl | null>(null);
	const src = $state('');

	const set = (src?: null | string) => {
		if (sound) {
			sound.stop();
			sound.unload();
			sound.off();
		}

		sound = src
			? new Howl({
					loop: true,
					onplay: () => (playing = true),
					onstop: () => (playing = false),
					src
				})
			: null;
	};

	return {
		get playing() {
			return playing;
		},
		set,
		get sound() {
			return sound;
		},
		get src() {
			return src;
		}
	};
};

export const soundStore = getSoundStore();
