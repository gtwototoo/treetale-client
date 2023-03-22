import type { IBoundings, ICoordinates, IFrame, IStory } from '.';

export interface IFrameCreate extends IFrame, IBoundings {
	rotated: boolean;
	hidden: boolean;
	title: string;
}

export interface IConnect {
	active: boolean;
	connector: {
		from: { frameId: number; choiceId: number };
		to: number;
		prevOutput: number;
		mouseCoords: ICoordinates;
	};
}

export interface IMove {
	hovered: number;
	active: boolean;
	oneDirectionMode: boolean;
}

export interface IStoryCreate extends IStory {
	grabbing: boolean;
	addFrameMode: boolean;
	addFrameOffset: ICoordinates;
	dragImageMode: boolean;
	grabbingOffsets: ICoordinates;
	grabbingScale: number;
	draft: boolean;
	timer: NodeJS.Timeout;
	saved: boolean;
}
