import type { Story, User } from '.';

export interface ResponseStories {
	authors: ({ subscribersCount: number } & User)[];
	stories: Story[];
}

export interface ResponseResult {
	error: boolean;
	text: string;
}
