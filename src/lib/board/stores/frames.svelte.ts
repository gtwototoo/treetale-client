import type { Choice, Coordinates, Frame } from '$lib/types';

import { DEFAULT_FRAME_SIZE } from '$lib/constants';

const getAddFrameOffset = () => {
	let x = $state<Coordinates['x']>(0);
	let y = $state<Coordinates['y']>(0);

	const set = (value: Coordinates) => {
		x = value.x;
		y = value.y;
	};

	const clear = () => {
		x = 0;
		y = 0;
	};

	return {
		clear,
		set,
		get x() {
			return x;
		},
		get y() {
			return y;
		}
	};
};

const getBoardFrames = () => {
	let frames = $state<Frame[]>([]);

	const init = (data: Frame[]) => {
		data.map((frame) => {
			const height = DEFAULT_FRAME_SIZE.height + 37 * frame.choices.length - 1;

			return [{ ...frame, height }];
		});

		frames = data;
	};

	return {
		get frames() {
			return frames;
		},
		set frames(updatedFrames: Frame[]) {
			frames = [...updatedFrames];
		},
		init
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

const getMovingFrame = () => {
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

export const movingFrameStore = getMovingFrame();
export const connectionStartStore = getConnectionStart();
export const selectedFrameStore = getSelectedFrame();
export const boardFramesStore = getBoardFrames();
export const addFrameOffsetStore = getAddFrameOffset();
