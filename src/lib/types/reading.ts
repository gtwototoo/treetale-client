import type { IStory, IUser, IVariable } from '.';

export interface IStoryReading extends IStory {
	likes: Array<number>;
	userId: number;
}

export type IStoryFull = IStoryReading & { vars: Array<IVariable>; author?: IUser };
