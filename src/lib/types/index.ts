export interface IStoryEditableInfo {
	title: string;
	description: string;
	tags: string[];
	imageId?: string | null;
	color: RGB;
	draft: boolean;
}

export type IPage = 'edit' | 'reading' | 'auth' | 'profile' | 'main';

export type RGB = [number, number, number];

export interface IStory extends IStoryEditableInfo {
	storyId: number;
	created: number;
}

export interface IChoice {
	choiceId: number;
	frameId: number;
	text: string;
	y?: number;
	[index: string]: number | string | undefined;
}

export interface IFrame {
	frameId: number;
	choices: IChoice[];
	text: string | null;
	imageId: string | null;
	[index: string]: unknown;
}

export interface IVariable {
	name: string;
	expect: 'Строка' | 'Число' | 'Да/Нет';
	value: string;
}

export interface ICoordinates {
	x: number;
	y: number;
}

export interface IBoundings extends ICoordinates {
	width: number;
	height: number;
}

export interface IProgressData {
	storyId: number;
	version: number;
	readerId: number;
	frames: IFrame[];
	choices: number[];
	started?: number;
}

export interface IUser {
	userId: number;
	sessionId: string | null;
	email: string;
	name: string;
	avatarId: string | null;
	created: number;
	color: RGB | null;
	[index: string]: string | number | null | RGB;
}
