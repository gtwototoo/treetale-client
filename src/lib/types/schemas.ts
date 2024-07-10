import type { ICoordinates, IStory, IVariable } from '.';
import type { IFrameCreate, INote } from './editing';

export interface IStorySchema extends IStory {
	[index: string]: Array<unknown> | ICoordinates | boolean | number | string;
	darkTheme: boolean;
	frames: Array<IFrameCreate>;
	imageUrl: string;
	likes: Array<number>;
	notes: Array<INote>;
	offset: ICoordinates;
	userId: number;
	vars: Array<IVariable>;
	zoom: number;
}
