import { DEFAULT_FRAME_HEIGHT } from '$lib/constants';
import type { IBoundings, IChoice, ICoordinates } from '$lib/types';
import type { IFrameCreate, IPath } from '$lib/types/editing';
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

	const findData: { frame: IFrameCreate; choice?: IChoice } = {
		frame
	};

	if (choiceId !== undefined && frame) {
		const choice = frame.choices.find((choice) => choice.choiceId === choiceId);

		findData.choice = choice;
	}

	return findData;
};

export const getChoicePosition = (index: number) => {
	return DEFAULT_FRAME_HEIGHT + 37 * index - 1;
};

export const createConnections = (frames: IFrameCreate[]) => {
	const paths: IPath[] = [];
	const area: IBoundings = getAreaBoundings(frames);
	const { width, height, x, y } = area;

	for (const fromFrame of frames) {
		for (const choice of fromFrame.choices) {
			if (choice.frameId === null) continue;

			const toFrame = getFrameFromId(frames, choice.frameId).frame;

			if (!toFrame) continue;

			const fromPoint = {
				x: fromFrame.x + fromFrame.width,
				y:
					fromFrame.y +
					(fromFrame.hidden
						? fromFrame.height / 2
						: getChoicePosition(fromFrame.choices.indexOf(choice)))
			};
			const toPoint = {
				x: toFrame.x,
				y: toFrame.y + toFrame.height / 2
			};

			paths.push({
				connectId: `${fromFrame.frameId}-${toFrame.frameId}`,
				line: createLine(fromPoint, toPoint)
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

const createLine = (from: ICoordinates, to: ICoordinates): string => {
	return `M${from.x} ${from.y} L ${to.x} ${to.y}`;
};

const getAreaBoundings = (frames: IFrameCreate[]) => {
	const { minX, minY, maxX, maxY } = frames.reduce(
		(acc, { x, y, width, height }) => ({
			minX: Math.min(acc.minX, x),
			minY: Math.min(acc.minY, y),
			maxX: Math.max(acc.maxX, x + width),
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

export const framesCorrect = (frames: IFrameCreate[]) => {
	const correct: IFrameCreate[] = [];

	for (const frame of frames) {
		const frameCorrect: IFrameCreate = exclude(frame, ['width', 'height']);

		correct.push(frameCorrect);
	}

	return correct;
};
