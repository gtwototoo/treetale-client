import type { IFrameCreate } from './editing';

import type { ICoordinates, IStory, IVariable } from '.';

export interface IStorySchema extends IStory {
	frames: Array<IFrameCreate>;
	vars: Array<IVariable>;
	userId: number;
	likes: Array<number>;
	offset: ICoordinates;
	zoom: number;
	version: number;
	imageId: string;
	[index: string]: number | ICoordinates | Array<unknown> | string | boolean;
}
