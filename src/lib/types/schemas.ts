import type { ICoordinates, IStory, IVariable } from '.';

import type { IFrameCreate } from './editing';

export interface IStorySchema extends IStory {
	[index: string]: number | ICoordinates | Array<unknown> | string | boolean;
	frames: Array<IFrameCreate>;
	imageUrl: string;
	likes: Array<number>;
	offset: ICoordinates;
	userId: number;
	vars: Array<IVariable>;
	version: number;
	zoom: number;
}
