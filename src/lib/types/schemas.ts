import type { ICoordinates, IStory, IVariable } from '.';
import type { IFrameCreate } from './editing';

export interface IStorySchema extends IStory {
	frames: IFrameCreate[];
	vars: IVariable[];
	userId: number;
	likes: number[];
	grabbingOffsets: ICoordinates;
	grabbingScale: number;
	version: number;
	[index: string]: number | ICoordinates | unknown[] | string | boolean;
}
