import type { Story, User } from '.';

export interface ResponseStories {
	authors: ({ subscribersCount: number } & User)[];
	stories: Story[];
}

export interface FetchResponse<T> {
	error: boolean;
	message: T;
}
