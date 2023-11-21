import { get } from 'svelte/store';
import { Plus } from 'svelte-heros-v2';

import { changesHistory } from '$lib/stores/editing';
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
import { getFrameFromId, last } from '$lib/utils';

export const addFrame = ({ x, y }: ICoordinates) => {
	const framesData = get(framesDataStore);

	if (!framesData) return;

	const lastFrameId = last(framesData)?.frameId;

	if (!lastFrameId) return;

	framesDataStore.update((data: Array<IFrameCreate>) => {
		data.push({
			imageId: null,
			title: `Блок ${lastFrameId}`,
			frameId: lastFrameId + 1,
			x,
			y,
			text: null,
			hidden: false,
			choices: [],
			height: 0
		} satisfies IFrameCreate);

		return data;
	});

	changesHistory.add('Добавление фрейма', Plus);

	return lastFrameId;
};

export const startMoveArea = ({ x, y }: ICoordinates): ICoordinates => {
	const offset = get(offsetStore);

	activeActionStore.set('movingArea');

	return {
		x: x - offset.x,
		y: y - offset.y
	};
};

export const movingArea = ({ x, y }: ICoordinates, startOffset: ICoordinates) => {
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

export const cursorFollow = (coords: ICoordinates) => {
	const cursorCoords = zoomCorrect(coords);

	addFrameOffsetStore.set(cursorCoords);
};
