import type { IStory, IVariable } from '.';

export interface IStoryReading extends IStory {
	likes: number[];
}

export type IStoryFull = { userId: number } & { vars: IVariable[] } & IStoryReading;
