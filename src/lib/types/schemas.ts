import type { ICoordinates, IStory, IVariable } from '.';
import type { IFrameCreate, INote } from './editing';

export interface IStorySchema extends IStory {
	[index: string]: number | ICoordinates | Array<unknown> | string | boolean;
	darkTheme: boolean;
	frames: Array<IFrameCreate>;
	imageUrl: string;
	likes: Array<number>;
	notes: Array<INote>;
	offset: ICoordinates;
	userId: number;
	vars: Array<IVariable>;
	version: number;
	zoom: number;
}
