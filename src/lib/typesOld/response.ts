import type { IUser } from '.';
import type { IStoryFull } from './reading';

export interface IResponseStories {
	authors: IUser[];
	stories: IStoryFull[];
}
