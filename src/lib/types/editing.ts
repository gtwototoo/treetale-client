import type { ICoordinates, IFrame, TBoundings } from '.';

export interface IFrameCreate extends IFrame, TBoundings {
	rotated: boolean;
	hidden: boolean;
	title: string;
}

export interface IPath {
	line: string;
	connectId: string;
}

export interface IConnect {
	active: boolean;
	connector: {
		from: { frameId: number; choiceId: number } | null;
		to: number | null;
		prevOutput: number | null;
		mouseCoords: ICoordinates | null;
	};
}

export interface IStartMove {
	startMoveCoords: ICoordinates;
	moveFrameOffset: ICoordinates;
	moveXDirection: boolean | null;
}
