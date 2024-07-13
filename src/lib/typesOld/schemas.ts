import type { ICoordinates, IStory, IVariable } from '.';
import type { IFrameCreate, INote } from './editing';

export interface IStorySchema extends IStory {
	[index: string]: unknown[] | ICoordinates | boolean | number | string;
	darkTheme: boolean;
	frames: IFrameCreate[];
	imageUrl: string;
	likes: number[];
	notes: INote[];
	offset: ICoordinates;
	userId: number;
	vars: IVariable[];
	zoom: number;
}
