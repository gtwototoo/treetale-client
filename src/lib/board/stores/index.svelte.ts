import { updateArea } from '$board/requests/story';
import omit from 'lodash/omit';

import type { Coordinates, Frame, Sizes } from '$lib/types';

import { boardFramesStore } from './frames.svelte';
import { storyInfoStore } from './info.svelte';

export type ActionType = 'connectTo' | 'dragImage' | 'movingArea' | 'movingFrame';
export type ModeType = 'adding' | 'binding' | 'view';
export type StateType = 'await' | 'error' | 'saved' | 'saving';

export const simpleStore = <T>(key: string, initialValue?: T) => {
	let value = $state<T | undefined>(initialValue);

	return {
		get [key]() {
			return value;
		},
		set [key](newValue: T) {
			value = newValue;
		}
	};
};

const getBoardState = () => {
	let zoom = $state<number>(100);
	let offset = $state<Coordinates>({ x: 0, y: 0 });
	let action = $state<ActionType | null>(null);
	let mode = $state<ModeType>('view');
	let state = $state<StateType>('await');

	return {
		get action() {
			return action;
		},
		set action(value) {
			action = value;
		},
		get mode() {
			return mode;
		},
		set mode(value) {
			mode = value;
		},
		get offset() {
			return offset;
		},
		set offset(value) {
			offset = value;
		},
		get state() {
			return state;
		},
		set state(value) {
			state = value;
		},
		get zoom() {
			return zoom;
		},
		set zoom(value) {
			zoom = value;
		}
	};
};

const getReadonlyMode = () => {
	let isEnabled = $state<boolean>(false);

	return {
		get isEnabled() {
			return isEnabled;
		},
		set isEnabled(value) {
			isEnabled = value;
		}
	};
};

const getOneDirectionMode = () => {
	let isEnabled = $state<boolean>(false);

	return {
		get isEnabled() {
			return isEnabled;
		},
		set isEnabled(value) {
			isEnabled = value;
		}
	};
};

const getBoardParams = () => {
	let width = $state<Sizes['width']>(0);
	let height = $state<Sizes['height']>(0);

	return {
		get height() {
			return height;
		},
		set height(value) {
			height = value;
		},
		get width() {
			return width;
		},
		set width(value) {
			width = value;
		}
	};
};

const getBoardEvents = () => {
	let timer = $state<number>(0);

	const save = () => {
		if (readonlyModeStore.isEnabled) {
			return;
		}

		clearTimeout(timer);
		boardStateStore.state = 'saving';

		timer = window.setTimeout(async () => {
			if (storyInfoStore.info) {
				try {
					const correctFrames = boardFramesStore.frames.map(
						(frame) => omit(frame, ['height']) as Frame
					);

					await updateArea(
						storyInfoStore.info.storyId,
						correctFrames,
						boardStateStore.offset,
						boardStateStore.zoom
					);

					boardStateStore.state = 'saved';
				} catch (error) {
					console.error(error);

					boardStateStore.state = 'error';
				}
			} else {
				boardStateStore.state = 'await';
			}

			clearTimeout(timer);
		}, 3000);
	};

	return {
		save
	};
};

export const boardEventsStore = getBoardEvents();
export const boardParamsStore = getBoardParams();
export const readonlyModeStore = getReadonlyMode();
export const boardStateStore = getBoardState();
export const oneDirectionModeStore = getOneDirectionMode();

export const isBinding = () => boardStateStore.mode === 'binding';
export const isView = () => boardStateStore.mode === 'view';
export const isAdding = () => boardStateStore.mode === 'adding';

export const zoomCorrect = (coordinates: Coordinates) => {
	return {
		x: (coordinates.x - boardStateStore.offset.x) / (boardStateStore.zoom / 100),
		y: (coordinates.y - boardStateStore.offset.y) / (boardStateStore.zoom / 100)
	};
};
