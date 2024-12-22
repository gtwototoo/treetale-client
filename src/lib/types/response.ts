import type { ProgressSchema } from './schemas';

import type { Frame, Story, User } from '.';

export interface ResponseStories {
	authors: ({ subscribersCount: number } & User)[];
	stories: Story[];
}

export interface FetchResponse<T> {
	error: boolean;
	message: T;
}

export interface Progress {
	author: {
		subscribersCount: number;
	} & User;
	archived: boolean;
	story: Story;
}

export interface ResponseProgress extends Progress {
	scopeFrames: Frame[];
	progress: Pick<ProgressSchema, 'isArchived' | 'version' | 'updated' | 'progressId' | 'choices'>;
}

export interface ResponseResults extends Progress {
	scopeFrames: Frame[];
	progress: Pick<ProgressSchema, 'endFrame' | 'version' | 'updated' | 'resultId'> & {
		choicesCount: number;
	};
}
