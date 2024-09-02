import { addBlockOffsetStore, movingBlockStore } from '$board/stores/blocks.svelte';
import { boardCommentsStore } from '$board/stores/comments.svelte';
import { boardFramesStore, selectedFrameStore } from '$board/stores/frames.svelte';
import { changesHistoryStore } from '$board/stores/history.svelte';
import { boardStateStore, oneDirectionModeStore, zoomCorrect } from '$board/stores/index.svelte';
import { panelStatesStore } from '$board/stores/panel.svelte';
import { findPrevFrames } from '$board/utils/editing';
import findIndex from 'lodash/findIndex';
import last from 'lodash/last';
import { Plus } from 'svelte-heros-v2';

import type { Coordinates, Frame, StartMoveParams } from '$lib/types';

import FrameSettingsSvelte from './Panel/FrameSettings.svelte';

export const connectedWithStart = (frameId: number) => {
	if (frameId === 1) return false;

	if (!boardFramesStore.frames) return false;

	const checkConnectedWithStart = (frameId: number): boolean => {
		const frames = findPrevFrames(boardFramesStore.frames, frameId);

		if (!frames.length) return false;

		for (const { frameId } of frames) {
			if (frameId === 1) {
				return true;
			} else {
				return checkConnectedWithStart(frameId);
			}
		}

		return false;
	};

	return checkConnectedWithStart(frameId);
};

export const addComment = ({ x, y }: Coordinates) => {
	const lastCommentId = last(boardCommentsStore.comments)?.commentId || 0;

	boardCommentsStore.comments.push({
		commentId: lastCommentId + 1,
		height: 0,
		text: '',
		width: 0,
		x,
		y
	});

	changesHistoryStore.add('Добавление заметки', Plus);

	return lastCommentId;
};

export const addFrame = ({ x, y }: Coordinates) => {
	const lastFrameId = last(boardFramesStore.frames)?.frameId || 0;

	boardFramesStore.frames.push({
		choices: [],
		frameId: lastFrameId + 1,
		height: 0,
		hidden: false,
		imageUrl: null,
		isEnd: false,
		isStart: false,
		modificators: [],
		soundUrl: null,
		text: '',
		title: `Блок ${lastFrameId}`,
		x,
		y
	});

	changesHistoryStore.add('Добавление блока', Plus);

	return lastFrameId;
};

export const startMoveArea = ({ x, y }: Coordinates): Coordinates => {
	boardStateStore.action = 'movingArea';

	return {
		x: x - boardStateStore.offset.x,
		y: y - boardStateStore.offset.y
	};
};

export const movingArea = ({ x, y }: Coordinates, startOffset: Coordinates) => {
	boardStateStore.offset = {
		x: x - startOffset.x,
		y: y - startOffset.y
	};
};

export const movingBlock = (coords: Coordinates, startMoveData: StartMoveParams) => {
	const { moveFrameOffset, startMoveCoords } = startMoveData;

	if (!movingBlockStore.id) return null;

	let index;

	const store =
		movingBlockStore.type === 'frame' ? boardFramesStore.frames : boardCommentsStore.comments;

	if (movingBlockStore.type === 'frame') {
		index = findIndex(boardFramesStore.frames, { frameId: movingBlockStore.id });
	} else {
		index = findIndex(boardCommentsStore.comments, { commentId: movingBlockStore.id });
	}

	if (index === -1) return null;

	const { x, y } = zoomCorrect(coords);
	const newCoords: Coordinates = {
		x: x - moveFrameOffset.x,
		y: y - moveFrameOffset.y
	};

	if (oneDirectionModeStore.isEnabled) {
		const startDifference =
			Math.abs(newCoords.y - startMoveCoords.y) - Math.abs(newCoords.x - startMoveCoords.x);

		if (startMoveData.moveXDirection === null && Math.abs(startDifference) > 1) {
			startMoveData.moveXDirection = startDifference < 0;
		}

		const coordDirection = startMoveData.moveXDirection ? 'x' : 'y';

		store[index][coordDirection] = newCoords[coordDirection];
	} else {
		store[index] = Object.assign(store[index], newCoords);
	}

	return startMoveData.moveXDirection;
};

export const setSelectedFrame = (frame: Frame) => {
	selectedFrameStore.frameId = frame.frameId;

	panelStatesStore.set(`frame-${frame.frameId}`, FrameSettingsSvelte, {
		isEdit: true,
		title: frame.title
	});
};

const switchSelectedFrame = (prev?: boolean) => {
	if (!selectedFrameStore.frameId) return;

	const frameKey = findIndex(boardFramesStore.frames, { frameId: selectedFrameStore.frameId });
	const newFrameKey = prev ? frameKey - 1 : frameKey + 1;
	const nextFrame = prev ? last(boardFramesStore.frames)! : boardFramesStore.frames[0];

	const frame =
		newFrameKey in boardFramesStore.frames ? boardFramesStore.frames[newFrameKey] : nextFrame;

	setSelectedFrame(frame);
};

export const nextSelectedFrame = () => {
	return switchSelectedFrame();
};

export const prevSelectedFrame = () => {
	return switchSelectedFrame(true);
};

export const cursorFollow = (coords: Coordinates) => {
	const cursorCoords = zoomCorrect(coords);

	addBlockOffsetStore.set(cursorCoords);
};
