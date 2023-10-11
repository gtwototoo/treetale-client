import { changesHistory, connect } from '$lib/stores/editing';

import {
	activeActionStore,
	addFrameOffsetStore,
	framesDataStore,
	offsetStore,
	oneDirectionModeStore,
	selectedFrameStore,
	zoomCorrect
} from '$lib/stores/workspace';
import type { ICoordinates } from '$lib/types';
import type { IFrameCreate, IStartMove } from '$lib/types/editing';
import { getChoiceFromId, getFrameFromId, last } from '$lib/utils';
import { Plus, Share, XMark } from 'svelte-heros-v2';
import { get } from 'svelte/store';

export const addFrame = ({ x, y }: ICoordinates) => {
	const framesData = get(framesDataStore);

	if (!framesData) return;

	const frameId = last(framesData)?.frameId;

	if (!frameId) return;

	framesDataStore.update((data: IFrameCreate[]) => {
		data.push({
			imageId: null,
			title: `Блок ${frameId}`,
			frameId: frameId + 1,
			x,
			y,
			text: null,
			hidden: false,
			rotated: false,
			choices: [],
			width: 0,
			height: 0
		} satisfies IFrameCreate);

		return data;
	});

	changesHistory.add('Добавление фрейма', Plus);

	return frameId;
};

export const connectorLogic = () => {
	const connectStore = get(connect);
	const framesData = get(framesDataStore);

	if (!connectStore.active || connectStore.connector.from === null) return;

	const { to, from, prevOutput } = connectStore.connector;
	const frame = getFrameFromId(framesData, from.frameId);
	const choice = getChoiceFromId(frame, from.choiceId);

	if (!frame || !choice) return;

	if (to === null && prevOutput !== null) {
		changesHistory.add('Удаление связи', XMark);
	}

	if (to !== null) {
		choice.frameId = to;
		changesHistory.add('Добавление связи', Share);
	}

	connect.update((data) =>
		Object.assign(data, {
			connector: {
				from: null,
				to: null,
				mouseCoords: null
			}
		})
	);
};

export const startGrab = ({ x, y }: ICoordinates): ICoordinates => {
	const offset = get(offsetStore);

	activeActionStore.set('movingArea');

	return {
		x: x - offset.x,
		y: y - offset.y
	};
};

export const grabbingArea = ({ x, y }: ICoordinates, startOffset: ICoordinates) => {
	offsetStore.update(() => ({
		x: x - startOffset.x,
		y: y - startOffset.y
	}));
};
export const startMoveFrame = (coords: ICoordinates): IStartMove => {
	const framesData = get(framesDataStore);
	const getSelectedFrameStore = get(selectedFrameStore);
	const frame = getFrameFromId(framesData, getSelectedFrameStore);

	if (!frame) {
		return {
			startMoveCoords: { x: 0, y: 0 },
			moveFrameOffset: { x: 0, y: 0 },
			moveXDirection: null
		};
	}

	const { x, y } = zoomCorrect(coords);

	activeActionStore.set('movingFrame');

	return {
		moveFrameOffset: { x: x - frame.x, y: y - frame.y },
		startMoveCoords: {
			x: frame.x,
			y: frame.y
		},
		moveXDirection: null
	} satisfies IStartMove;
};

export const movingFrame = (coords: ICoordinates, startMoveData: IStartMove) => {
	const { moveFrameOffset, startMoveCoords } = startMoveData;
	const framesData = get(framesDataStore);
	const getOneDirectionModeStore = get(oneDirectionModeStore);
	const getSelectedFrameStore = get(selectedFrameStore);
	const frameIndex = framesData.findIndex(({ frameId }) => frameId === getSelectedFrameStore);

	if (frameIndex === -1) return null;

	const { x, y } = zoomCorrect(coords);
	const newCoords: ICoordinates = {
		x: x - moveFrameOffset.x,
		y: y - moveFrameOffset.y
	};

	if (getOneDirectionModeStore) {
		const startDifference =
			Math.abs(newCoords.y - startMoveCoords.y) - Math.abs(newCoords.x - startMoveCoords.x);

		if (startMoveData.moveXDirection === null && Math.abs(startDifference) > 1) {
			startMoveData.moveXDirection = startDifference < 0;
		}
		framesDataStore.update((data) => {
			const coord = startMoveData.moveXDirection ? 'x' : 'y';

			data[frameIndex][coord] = newCoords[coord];

			return data;
		});
	} else {
		framesDataStore.update((data) => {
			data[frameIndex] = Object.assign(data[frameIndex], newCoords);

			return data;
		});
	}

	return startMoveData.moveXDirection;
};

export const checkConnectorEndFrame = (grabCoords: ICoordinates) => {
	const framesData = get(framesDataStore);
	const connectStore = get(connect);

	for (const frame of framesData) {
		if (
			Math.abs(frame.x - grabCoords.x) <= 12 &&
			Math.abs(grabCoords.y - (frame.y + frame.height / 2)) <= 12
		) {
			if (connectStore.connector.from && frame.frameId !== connectStore.connector.from.frameId) {
				connect.update((data) => {
					data.connector = Object.assign(data.connector, {
						to: frame.frameId,
						mouseCoords: {
							x: frame.x,
							y: frame.y + frame.height / 2
						}
					});

					return data;
				});
			}

			break;
		}
		connect.update((data) => {
			data.connector.to = null;

			return data;
		});
	}
};

export const moveRivet = (coords: ICoordinates) => {
	const grabCoords = zoomCorrect(coords);

	connect.update((data) => {
		data.connector.mouseCoords = grabCoords;

		return data;
	});
	checkConnectorEndFrame(grabCoords);
};

export const cursorFollow = (coords: ICoordinates) => {
	const cursorCoords = zoomCorrect(coords);

	addFrameOffsetStore.set(cursorCoords);
};
