import { Plus } from 'svelte-heros-v2';
import { get } from 'svelte/store';

import { changesHistory } from '$lib/stores/history';
import { currentPanelStore } from '$lib/stores/main';
import {
	activeActionStore,
	addFrameOffsetStore,
	framesDataStore,
	movingFrameStore,
	offsetStore,
	oneDirectionModeStore,
	selectedFrameStore,
	zoomCorrect
} from '$lib/stores/workspace';
import type { ICoordinates } from '$lib/types';
import type { IFrameCreate, IStartMove } from '$lib/types/editing';
import { last } from '$lib/utils';
import { FrameSettings } from '../Panel';

export const addFrame = ({ x, y }: ICoordinates) => {
	const framesData = get(framesDataStore);

	if (!framesData) return;

	const lastFrameId = last(framesData)?.frameId;

	if (!lastFrameId) return;

	framesDataStore.update((data: Array<IFrameCreate>) => {
		data.push({
			imageUrl: null,
			title: `Блок ${lastFrameId}`,
			frameId: lastFrameId + 1,
			x,
			y,
			text: '',
			hidden: false,
			choices: [],
			height: 0
		} satisfies IFrameCreate);

		return data;
	});

	changesHistory.add('Добавление блока', Plus);

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

export const movingFrame = (coords: ICoordinates, startMoveData: IStartMove) => {
	const { moveFrameOffset, startMoveCoords } = startMoveData;
	const framesData = get(framesDataStore);
	const getOneDirectionModeStore = get(oneDirectionModeStore);
	const getMovingFrameStore = get(movingFrameStore);
	const frameIndex = framesData.findIndex(({ frameId }) => frameId === getMovingFrameStore);

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

export const setSelectedFrame = (frame: IFrameCreate) => {
	selectedFrameStore.set(frame.frameId);

	currentPanelStore.set({
		id: `frame-${frame.frameId}`,
		component: FrameSettings
	});
};

const switchSelectedFrame = (prev?: boolean) => {
	const getSelectedFrameStore = get(selectedFrameStore);
	const getFramesDataStore = get(framesDataStore);

	if (!getSelectedFrameStore) return;

	const frameKey = getFramesDataStore.findIndex(
		({ frameId }) => frameId === getSelectedFrameStore
	);

	let frame;

	if (prev) {
		frame =
			frameKey - 1 in getFramesDataStore
				? getFramesDataStore[frameKey - 1]
				: last(getFramesDataStore);
	} else {
		frame =
			frameKey + 1 in getFramesDataStore
				? getFramesDataStore[frameKey + 1]
				: getFramesDataStore[0];
	}

	setSelectedFrame(frame);
};

export const nextSelectedFrame = () => {
	return switchSelectedFrame();
};

export const prevSelectedFrame = () => {
	return switchSelectedFrame(true);
};

export const cursorFollow = (coords: ICoordinates) => {
	const cursorCoords = zoomCorrect(coords);

	addFrameOffsetStore.set(cursorCoords);
};
