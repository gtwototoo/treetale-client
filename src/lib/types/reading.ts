import type { IStory, IVariable } from '.';

export interface IStoryReading extends IStory {
	likes: Array<number>;
}

export type IStoryFull = { userId: number } & { vars: Array<IVariable> } & IStoryReading;
