import { Howl } from 'howler';

const getSoundStore = () => {
	let playing = $state(false);
	let sound = $state<Howl | null>(null);
	let seek = $state(0);
	let timer = $state(0);

	const clear = () => {
		if (sound) {
			sound.stop();
			sound.unload();
			sound.off();
			seek = 0;
		}

		sound = null;
	};

	const set = (src: string) => {
		clear();

		sound = new Howl({
			loop: true,
			onplay: () => (playing = true),
			onstop: () => {
				playing = false;
				seek = 0;
			},
			src
		});
	};

	$effect.root(() => {
		$effect(() => {
			if (sound && playing) {
				timer = window.setInterval(() => {
					seek = sound!.seek();
				}, 500);
			} else {
				clearInterval(timer);
			}
		});

		return () => {
			clearInterval(timer);
		};
	});

	return {
		clear,
		get playing() {
			return playing;
		},
		get seek() {
			return seek;
		},
		set,
		get sound() {
			return sound;
		}
	};
};

export const soundStore = getSoundStore();
