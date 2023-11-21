import type { ICoordinates, IFrame, TBoundings } from '.';

export interface IFrameCreate extends IFrame, Omit<TBoundings, 'width'> {
	hidden: boolean;
	title: string;
}

export interface IPath {
	connectId: string;
	line: string;
}

export interface IConnect {
	choiceId: number;
	frameId: number;
}

export interface IStartMove {
	moveFrameOffset: ICoordinates;
	moveXDirection: boolean | null;
	startMoveCoords: ICoordinates;
}
