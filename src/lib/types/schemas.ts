import type { Comment, Coordinates, Frame, Note, ProgressChoices, Story, Variable } from '.';

export interface StorySchema extends Story {
	[index: string]: Coordinates | boolean | number | string | unknown[];
	comments: Comment[];
	darkTheme: boolean;
	frames: Frame[];
	imageUrl: string;
	likes: number[];
	notes: Note[];
	offset: Coordinates;
	userId: number;
	vars: Variable[];
	zoom: number;
}

export interface ProgressSchema {
	choices: ProgressChoices[];
	progressId: number;
	storyId: number;
	version: string;
	readerId: number;
	isArchived: boolean;
	resultId?: number;
	endFrame?: Frame;
	started?: number;
	updated?: number;
}
