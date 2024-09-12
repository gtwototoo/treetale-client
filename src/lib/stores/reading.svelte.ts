import type { Frame } from '$lib/types';

const getInterface = () => {
	let show = $state(true);

	return {
		get show() {
			return show;
		},
		set show(value) {
			show = value;
		}
	};
};

const getFullscreen = () => {
	let isEnabled = $state(false);

	return {
		get isEnabled() {
			return isEnabled;
		},
		set isEnabled(value) {
			isEnabled = value;
		}
	};
};

const getAvailableFrames = () => {
	let frames = $state<Frame[]>([]);

	return {
		get frames() {
			return frames;
		},
		set frames(updatedFrames: Frame[]) {
			frames = [...updatedFrames];
		}
	};
};

export const framesStore = getAvailableFrames();
export const interfaceStore = getInterface();
export const fullscreenStore = getFullscreen();
