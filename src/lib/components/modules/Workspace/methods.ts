import {
	activeAction,
	changesHistory,
	connect,
	frames,
	moveMode,
	storyInfo
} from '$lib/stores/editing';
import type { ICoordinates } from '$lib/types';
import type { IFrameCreate, IStartMove } from '$lib/types/editing';
import { Plus, Share, XMark } from 'svelte-heros-v2';
import { get } from 'svelte/store';

export const addFrame = ({ x, y }: ICoordinates) => {
	const framesStore = get(frames);

	if (!framesStore) return;
	const frameId = framesStore.at(-1)?.frameId;

	if (!frameId) return;

	frames.update((data: IFrameCreate[]) => {
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

	changesHistory.add({
		title: 'Добавление фрейма',
		icon: Plus
	});

	return frameId;
};

export const connectorLogic = () => {
	const connectStore = get(connect);
	const framesStore = get(frames);

	if (!connectStore.active || connectStore.connector.from === null) return;

	const { to, from, prevOutput } = connectStore.connector;
	const frame = framesStore.find(({ frameId }) => frameId === from.frameId);

	if (!frame) return;

	const choice = frame.choices.find(({ choiceId }) => choiceId === from.choiceId);

	if (!choice) return;

	if (to === null && prevOutput !== null) {
		changesHistory.add({
			title: 'Удаление связи',
			icon: XMark
		});
	}

	if (to !== null) {
		choice.frameId = to;
		changesHistory.add({
			title: 'Добавление связи',
			icon: Share
		});
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
	const storyInfoStore = get(storyInfo);

	storyInfo.update((data) => Object.assign(data, { grabbing: true }));
	activeAction.set('Перемещение');

	return {
		x: x - storyInfoStore.grabbingOffsets.x,
		y: y - storyInfoStore.grabbingOffsets.y
	};
};

export const grabbingArea = ({ x, y }: ICoordinates, startGrabbingOffsets: ICoordinates) => {
	storyInfo.update((data) =>
		Object.assign(data, {
			grabbingOffsets: {
				x: x - startGrabbingOffsets.x,
				y: y - startGrabbingOffsets.y
			}
		})
	);
};

export const startMoveFrame = (coords: ICoordinates): IStartMove => {
	const framesStore = get(frames);
	const moveModeStore = get(moveMode);
	const frame = framesStore.find(({ frameId }) => frameId === moveModeStore.hovered);

	if (!frame)
		return {
			startMoveCoords: { x: 0, y: 0 },
			moveFrameOffset: { x: 0, y: 0 },
			moveXDirection: null
		};

	const { x, y } = storyInfo.scaleCorrect(coords);

	moveMode.update((data) => Object.assign(data, { active: true }));
	activeAction.set('Перемещение');

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
	const framesStore = get(frames);
	const moveModeStore = get(moveMode);
	const frameIndex = framesStore.findIndex(({ frameId }) => frameId === moveModeStore.hovered);

	if (frameIndex === -1) return null;

	const { x, y } = storyInfo.scaleCorrect(coords);
	const newCoords: ICoordinates = {
		x: x - moveFrameOffset.x,
		y: y - moveFrameOffset.y
	};

	if (moveModeStore.oneDirectionMode) {
		const startDifference =
			Math.abs(newCoords.y - startMoveCoords.y) - Math.abs(newCoords.x - startMoveCoords.x);

		if (startMoveData.moveXDirection === null && Math.abs(startDifference) > 1) {
			startMoveData.moveXDirection = startDifference < 0;
		}
		frames.update((data) => {
			const coord = startMoveData.moveXDirection ? 'x' : 'y';

			data[frameIndex][coord] = newCoords[coord];

			return data;
		});
	} else {
		frames.update((data) => {
			data[frameIndex] = Object.assign(data[frameIndex], newCoords);

			return data;
		});
	}

	return startMoveData.moveXDirection;
};

export const checkConnectorEndFrame = (grabCoords: ICoordinates) => {
	const framesStore = get(frames);
	const connectStore = get(connect);

	for (const frame of framesStore) {
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
	const grabCoords = storyInfo.scaleCorrect(coords);

	connect.update((data) => {
		data.connector.mouseCoords = grabCoords;

		return data;
	});
	checkConnectorEndFrame(grabCoords);
};

export const cursorFollow = (coords: ICoordinates) => {
	const cursorCoords = storyInfo.scaleCorrect(coords);

	storyInfo.update((data) => Object.assign(data, { addFrameOffset: cursorCoords }));
	activeAction.set('Перемещение');
};
