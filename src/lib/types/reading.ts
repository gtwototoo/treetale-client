import type { IStory, IUser, IVariable } from '.';

export interface IStoryReading extends IStory {
	likes: number[];
	userId: number;
}

export type IStoryFull = IStoryReading & { vars: IVariable[]; author?: IUser };
