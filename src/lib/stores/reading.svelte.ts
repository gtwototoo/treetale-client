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

const getLoadingChoice = () => {
	let frameId = $state<null | number>(null);
	let choiceId = $state<null | number>(null);

	const set = (newFrameId: number, newChoiceId: number) => {
		frameId = newFrameId;
		choiceId = newChoiceId;
	};

	const clear = () => {
		frameId = null;
		choiceId = null;
	};

	return {
		get choiceId() {
			return choiceId;
		},
		clear,
		get frameId() {
			return frameId;
		},
		set
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

export const loadingStore = getLoadingChoice();
export const framesStore = getAvailableFrames();
export const interfaceStore = getInterface();
export const fullscreenStore = getFullscreen();
