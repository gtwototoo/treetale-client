import find from 'lodash/find';

import { DEFAULT_BLOCK_WIDTH, DEFAULT_FRAME_HEIGHT } from '$lib/constants';
import type { Bounding, Choice, ConnectPath, Coordinates, Frame, Note, Variable } from '$lib/types';
import { clm } from '$lib/utils/classMerge';

export const transform = (coords: Coordinates, zoom?: number): string => {
	let styleRow = 'transform:';

	styleRow += `translate3d(${coords?.x || 0}px,${coords?.y || 0}px,0)`;
	if (zoom) {
		styleRow += `scale3d(${zoom}, ${zoom}, 1)`;
	}

	return styleRow;
};

export const findPrevFrames = (frames: Frame[], frameId: number) => {
	const prevFrames: Frame[] = [];

	for (const frame of frames) {
		const isPrevFrame = frame.choices.some((choice) => choice.frameId === frameId);

		if (isPrevFrame) {
			prevFrames.push(frame);
		}
	}

	return prevFrames;
};

export const getChoicePosition = (index: number, imageUrl: null | string) => {
	let startPosition = DEFAULT_FRAME_HEIGHT - 8 - 40 / 2;

	if (imageUrl) {
		startPosition += 156;
	}

	return startPosition + 41 * index - 1;
};

const getFramesPoints = (fromFrame: Frame, choice: Choice, toFrame: Frame) => {
	const fromFrameLeftSide = fromFrame.x < toFrame.x;
	const fromPoint = {
		x: fromFrameLeftSide ? fromFrame.x + DEFAULT_BLOCK_WIDTH : fromFrame.x,
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

export const createConnections = (frames: Frame[]) => {
	const paths: ConnectPath[] = [];
	const { height, width, x, y }: Bounding = getAreaBoundings(frames);

	for (const fromFrame of frames) {
		for (const choice of fromFrame.choices) {
			if (choice.frameId === null) continue;

			const toFrame = find(frames, { frameId: choice.frameId }) as Frame;

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

export const createLineRemoveButtons = (frames: Frame[]) => {
	const coords: ({ fromChoiceId: number; fromFrameId: number } & Coordinates)[] = [];

	for (const fromFrame of frames) {
		for (const choice of fromFrame.choices) {
			if (choice.frameId === null) continue;

			const toFrame = find(frames, { frameId: choice.frameId }) as Frame;

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

export const createLine = (from: Coordinates, to: Coordinates): string => {
	return `M${from.x} ${from.y} L ${to.x} ${to.y}`;
};

function getControl(from: Coordinates, to: Coordinates): Coordinates {
	const x = 0.5 * (from.x + to.x),
		y = from.y;

	return { x, y };
}

export const createBezierLine = (from: Coordinates, to: Coordinates): string => {
	const fromControl = getControl(from, to);
	const toControl = getControl(to, from);

	return `M${from.x},${from.y} C${fromControl.x},${fromControl.y} ${toControl.x},${toControl.y} ${to.x},${to.y}`;
};

const getAreaBoundings = (frames: Frame[]) => {
	const { maxX, maxY, minX, minY } = frames.reduce(
		(acc, { height, x, y }) => ({
			maxX: Math.max(acc.maxX, x + DEFAULT_BLOCK_WIDTH),
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

export const variablesHighlight = (html: string, vars: Variable[]) => {
	const variableRegex = /{([a-zA-Z0-9а-яА-Я]+)}/g;
	const conditionRegex =
		/{\? [a-zA-Z0-9а-яА-Я]+ == (?:[0-9]+|Да|Нет|"[a-zA-Z0-9а-яА-Я]+"|'[a-zA-Z0-9а-яА-Я]+')}|{:}|{\/\?}/g;

	[variableRegex, conditionRegex].forEach((regex, index) => {
		html = html.replace(regex, (match, variable) => {
			if (index === 0) {
				const varExists = vars.some(({ name }) => name === variable);

				return `<span class="${clm(varExists ? 'text-violet-500 bg-violet-500/5' : 'text-red-500 bg-red-500/5')}">${match}</span>`;
			} else {
				return `<span class="${clm('text-orange-500 bg-orange-500/5')}">${match}</span>`;
			}
		});
	});

	return html;
};

export const notesHighlight = (html: string, notes: Note[]) => {
	for (const { tags } of notes) {
		for (const tag of tags) {
			html = html.replaceAll(tag, `<span class="text-orange-500">${tag}</span>`);
		}
	}

	return html;
};
