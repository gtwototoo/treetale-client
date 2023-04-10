import type { IBoundings, ICoordinates, IFrame, IStory } from '.';

export interface IFrameCreate extends IFrame, IBoundings {
	rotated: boolean;
	hidden: boolean;
	title: string;
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

export interface IMove {
	hovered: number | null;
	active: boolean;
	oneDirectionMode: boolean;
}

export interface IStartMove {
	startMoveCoords: ICoordinates;
	moveFrameOffset: ICoordinates;
	moveXDirection: boolean | null;
}

export interface IStoryCreate extends IStory {
	addFrameMode: boolean;
	addFrameOffset: ICoordinates | null;
	dragImageMode: boolean;
	offset: ICoordinates;
	scale: number;
	draft: boolean;
	timer: number;
	saved: boolean;
}
