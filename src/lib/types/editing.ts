import type { ICoordinates, IFrame, TBoundings } from '.';

export interface IFrameCreate extends IFrame, Omit<TBoundings, 'width'> {
	hidden: boolean;
	title: string;
}

export interface IPath {
	line: string;
	connectId: string;
}

export interface IConnect {
	frameId: number;
	choiceId: number;
}

export interface IStartMove {
	startMoveCoords: ICoordinates;
	moveFrameOffset: ICoordinates;
	moveXDirection: boolean | null;
}
