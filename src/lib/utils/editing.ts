import type { IChoice, ICoordinates, IFrame, IVariable, TBoundings } from '$lib/types';
import type { IFrameCreate, INote, IPath } from '$lib/types/editing';

import { DEFAULT_FRAME_SIZE } from '$lib/constants';
import clsx from 'clsx';

export const transform = (coords: ICoordinates, zoom?: number): string => {
	let styleRow = 'transform:';

	styleRow += `translate3d(${coords?.x || 0}px,${coords?.y || 0}px,0)`;
	if (zoom) {
		styleRow += `scale3d(${zoom}, ${zoom}, 1)`;
	}

	return styleRow;
};

export const getFrameFromId = <T extends IFrameCreate | IFrame>(
	frames: Array<T>,
	frameId: number
) => {
	const frame = frames.find((frame) => frame.frameId === frameId);

	return frame;
};

export const getChoiceFromId = (frame: IFrameCreate | IFrame, choiceId: number) => {
	if (!frame) return;

	const choice = frame.choices.find((choice) => choice.choiceId === choiceId);

	return choice;
};

export const getChoicePosition = (index: number, imageUrl: string) => {
	let startPosition = DEFAULT_FRAME_SIZE.height - 8 - 40 / 2;

	if (imageUrl) {
		startPosition += 156;
	}

	return startPosition + 41 * index - 1;
};

const getFramesPoints = (fromFrame: IFrameCreate, choice: IChoice, toFrame: IFrameCreate) => {
	const fromPoint = {
		x: fromFrame.x + DEFAULT_FRAME_SIZE.width,
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
	const area: TBoundings = getAreaBoundings(frames);
	const { width, height, x, y } = area;

	for (const fromFrame of frames) {
		for (const choice of fromFrame.choices) {
			if (choice.frameId === null) continue;

			const toFrame = getFrameFromId(frames, choice.frameId) as IFrameCreate;

			if (!toFrame) continue;

			const { fromPoint, toPoint } = getFramesPoints(fromFrame, choice, toFrame);

			paths.push({
				connectId: `${fromFrame.frameId}:${choice.choiceId}-${toFrame.frameId}`,
				line: createBezierLine(fromPoint, toPoint)
			});
		}
	}

	return {
		paths,
		viewBox: Object.values(area).join(' '),
		width,
		height,
		style: transform({ x, y })
	};
};

export const createLineRemoveButtons = (frames: Array<IFrameCreate>) => {
	const coords: Array<ICoordinates & { fromFrameId: number; fromChoiceId: number }> = [];

	for (const fromFrame of frames) {
		for (const choice of fromFrame.choices) {
			if (choice.frameId === null) continue;

			const toFrame = getFrameFromId(frames, choice.frameId) as IFrameCreate;

			if (!toFrame) continue;

			const { fromPoint, toPoint } = getFramesPoints(fromFrame, choice, toFrame);

			coords.push({
				x: (fromPoint.x + toPoint.x) / 2,
				y: (fromPoint.y + toPoint.y) / 2,
				fromFrameId: fromFrame.frameId,
				fromChoiceId: choice.choiceId
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
	const { minX, minY, maxX, maxY } = frames.reduce(
		(acc, { x, y, height }) => ({
			minX: Math.min(acc.minX, x),
			minY: Math.min(acc.minY, y),
			maxX: Math.max(acc.maxX, x + DEFAULT_FRAME_SIZE.width),
			maxY: Math.max(acc.maxY, y + height)
		}),
		{
			minX: Infinity,
			minY: Infinity,
			maxX: -Infinity,
			maxY: -Infinity
		}
	);

	return {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY
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
