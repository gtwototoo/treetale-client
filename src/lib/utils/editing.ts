import type { IBoundings, IChoice, ICoordinates } from '$lib/types';
import type { IConnect, IFrameCreate } from '$lib/types/editing';
import { exclude } from './serialize';

export const transform = (coords: ICoordinates, scale?: number): string => {
	let styleRow = 'transform:';

	styleRow += `translate3d(${coords?.x || 0}px,${coords?.y || 0}px,0)`;
	if (scale) {
		styleRow += `scale3d(${scale}, ${scale}, 1)`;
	}

	return styleRow;
};

export const getFrameFromId = (frames: IFrameCreate[], frameId: number, choiceId?: number) => {
	const frame = frames.find((frame) => frame.frameId === frameId);

	if (!frame) return;

	const findData: { frame: IFrameCreate; choice?: IChoice } = {
		frame
	};

	if (choiceId !== undefined) {
		const choice = frame.choices.find((choice) => choice.choiceId === choiceId);

		findData.choice = choice;
	}

	return findData;
};

const createLine = (from: ICoordinates, to: ICoordinates): string => {
	return `M${from.x} ${from.y} L ${to.x} ${to.y}`;
};

export const createCords = (frames: IFrameCreate[], connect?: IConnect) => {
	const paths: string[] = [];
	const min: ICoordinates = { x: null, y: null };
	const max: ICoordinates = { x: null, y: null };

	for (const frame of frames) {
		cordsLimits(frame, min, max);

		for (const choice of frame.choices) {
			if (choice.frameId !== null) {
				const endpoint = frames.find(({ frameId }) => frameId === choice.frameId);

				if (endpoint) {
					paths.push(createPath(frame, endpoint, choice.y));
				}
			}
		}
	}

	if (connect) {
		const {
			from,
			mouseCoords: { x, y }
		} = connect.connector;
		const startFrame: IFrameCreate = frames.find((frame) => frame.frameId === from.frameId);
		const startRivet = startFrame.choices.find((choice) => choice.choiceId === from.choiceId);
		const mousePoint: IBoundings = {
			x,
			y,
			width: 0,
			height: 0
		};
		cordsLimits(mousePoint, min, max);
		paths.push(createPath(startFrame, mousePoint, startRivet.y));
	}

	const areaSize = {
		left: min.x,
		top: min.y,
		width: max.x - min.x,
		height: max.y - min.y
	};

	return {
		paths,
		min,
		max,
		viewBox: Object.values(areaSize).join(' '),
		style: Object.entries(areaSize).reduce(
			(string, [key, value]) => (string += `${key}:${value}px;`),
			''
		)
	};
};

export const framesCorrect = (frames: IFrameCreate[]) => {
	const correct: IFrameCreate[] = [];

	for (const frame of frames) {
		const frameCorrect: IFrameCreate = exclude(frame, ['width', 'height']);

		frameCorrect.choices = [];

		for (const choice of frame.choices) {
			frameCorrect.choices.push(exclude(choice, 'y'));
		}

		correct.push(frameCorrect);
	}

	return correct;
};

const cordsLimits = (frame: IBoundings, min: ICoordinates, max: ICoordinates) => {
	if (min.x === null || frame.x < min.x) {
		min.x = frame.x;
	}
	if (min.y === null || frame.y < min.y) {
		min.y = frame.y;
	}
	if (!max.x || frame.x + frame.width > max.x) {
		max.x = frame.x + frame.width;
	}
	if (!max.y || frame.y + frame.height > max.y) {
		max.y = frame.y + frame.height;
	}
};
