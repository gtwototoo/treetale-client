import type { Choice, Frame } from '$lib/types';

const getBoardFrames = () => {
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

const getSelectedFrame = () => {
	let frameId = $state<null | number>(null);

	return {
		get frameId() {
			return frameId;
		},
		set frameId(value) {
			frameId = value;
		}
	};
};

const getConnectionStart = () => {
	let frameId = $state<Frame['frameId'] | null>(null);
	let choiceId = $state<Choice['choiceId'] | null>(null);

	const clear = () => {
		frameId = null;
		choiceId = null;
	};

	const set = (newFrameId: number, newChoiceId: number) => {
		frameId = newFrameId;
		choiceId = newChoiceId;
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

export const connectionStartStore = getConnectionStart();
export const selectedFrameStore = getSelectedFrame();
export const boardFramesStore = getBoardFrames();
