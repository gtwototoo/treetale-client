import clsx from 'clsx';
import find from 'lodash/find';

import type { IChoice, ICoordinates, IVariable, TBoundings } from '$lib/types';
import type { IFrameCreate, INote, IPath } from '$lib/types/editing';

import { DEFAULT_FRAME_SIZE } from '$lib/constants';

export const transform = (coords: ICoordinates, zoom?: number): string => {
	let styleRow = 'transform:';

	styleRow += `translate3d(${coords?.x || 0}px,${coords?.y || 0}px,0)`;
	if (zoom) {
		styleRow += `scale3d(${zoom}, ${zoom}, 1)`;
	}

	return styleRow;
};

export const findPrevFrames = (frames: Array<IFrameCreate>, frameId: number) => {
	const prevFrames: Array<IFrameCreate> = [];

	for (const frame of frames) {
		const isPrevFrame = frame.choices.some((choice) => choice.frameId === frameId);

		if (isPrevFrame) {
			prevFrames.push(frame);
		}
	}

	return prevFrames;
};

export const getChoicePosition = (index: number, imageUrl: string) => {
	let startPosition = DEFAULT_FRAME_SIZE.height - 8 - 40 / 2;

	if (imageUrl) {
		startPosition += 156;
	}

	return startPosition + 41 * index - 1;
};

const getFramesPoints = (fromFrame: IFrameCreate, choice: IChoice, toFrame: IFrameCreate) => {
	const fromFrameLeftSide = fromFrame.x < toFrame.x;
	const fromPoint = {
		x: fromFrameLeftSide ? fromFrame.x + DEFAULT_FRAME_SIZE.width : fromFrame.x,
		y:
			fromFrame.y +
			(fromFrame.hidden
				? fromFrame.height / 2
				: getChoicePosition(fromFrame.choices.indexOf(choice), fromFrame.imageUrl))
	};
	const toPoint = {
		x: toFrame.x,
		y: toFrame.y + 28 // расстояние от верха
	};

	return { fromPoint, toPoint };
};

export const createConnections = (frames: Array<IFrameCreate>) => {
	const paths: Array<IPath> = [];
	const { height, width, x, y }: TBoundings = getAreaBoundings(frames);

	for (const fromFrame of frames) {
		for (const choice of fromFrame.choices) {
			if (choice.frameId === null) continue;

			const toFrame = find(frames, { frameId: choice.frameId }) as IFrameCreate;

			if (!toFrame) continue;

			const { fromPoint, toPoint } = getFramesPoints(fromFrame, choice, toFrame);

			paths.push({
				connectId: `${fromFrame.frameId}:${choice.choiceId}-${toFrame.frameId}`,
				line: createBezierLine(fromPoint, toPoint)
			});
		}
	}

	return {
		height,
		paths,
		style: transform({ x, y }),
		viewBox: [x, y, width, height].join(' '),
		width
	};
};

export const createLineRemoveButtons = (frames: Array<IFrameCreate>) => {
	const coords: Array<{ fromChoiceId: number; fromFrameId: number } & ICoordinates> = [];

	for (const fromFrame of frames) {
		for (const choice of fromFrame.choices) {
			if (choice.frameId === null) continue;

			const toFrame = find(frames, { frameId: choice.frameId }) as IFrameCreate;

			if (!toFrame) continue;

			const { fromPoint, toPoint } = getFramesPoints(fromFrame, choice, toFrame);

			coords.push({
				fromChoiceId: choice.choiceId,
				fromFrameId: fromFrame.frameId,
				x: (fromPoint.x + toPoint.x) / 2,
				y: (fromPoint.y + toPoint.y) / 2
			});
		}
	}

	return coords;
};

export const createLine = (from: ICoordinates, to: ICoordinates): string => {
	return `M${from.x} ${from.y} L ${to.x} ${to.y}`;
};

function getControl(from: ICoordinates, to: ICoordinates): ICoordinates {
	const x = 0.5 * (from.x + to.x),
		y = from.y;

	return { x, y };
}

export const createBezierLine = (from: ICoordinates, to: ICoordinates): string => {
	const fromControl = getControl(from, to);
	const toControl = getControl(to, from);

	return `M${from.x},${from.y} C${fromControl.x},${fromControl.y} ${toControl.x},${toControl.y} ${to.x},${to.y}`;
};

const getAreaBoundings = (frames: Array<IFrameCreate>) => {
	const { maxX, maxY, minX, minY } = frames.reduce(
		(acc, { height, x, y }) => ({
			maxX: Math.max(acc.maxX, x + DEFAULT_FRAME_SIZE.width),
			maxY: Math.max(acc.maxY, y + height),
			minX: Math.min(acc.minX, x),
			minY: Math.min(acc.minY, y)
		}),
		{
			maxX: -Infinity,
			maxY: -Infinity,
			minX: Infinity,
			minY: Infinity
		}
	);

	return {
		height: maxY - minY,
		width: maxX - minX,
		x: minX,
		y: minY
	};
};

export const variablesHighlight = (html: string, vars: Array<IVariable>) => {
	const variableRegex = /{([a-zA-Z0-9]+)}/g;

	return html.replace(variableRegex, (match, variable) => {
		const varExists = vars.some(({ name }) => name === variable);

		return `<span class="${clsx(
			varExists ? 'text-violet-500' : 'text-red-500'
		)}">${match}</span>`;
	});
};

export const notesHighlight = (html: string, notes: Array<INote>) => {
	for (const { tags } of notes) {
		for (const tag of tags) {
			html = html.replaceAll(tag, `<span class="text-orange-500">${tag}</span>`);
		}
	}

	return html;
};
