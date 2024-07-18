import type { Coordinates, Frame, Note, Story, Variable } from '.';

export interface StorySchema extends Story {
	[index: string]: Coordinates | boolean | number | string | unknown[];
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
