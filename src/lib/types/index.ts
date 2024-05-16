import type { GENRES_LIST } from '$lib/constants';

import type { IStorySchema } from './schemas';

export type TRGB = [number, number, number];

export type TComparisonOperator = '<' | '=' | '>' | '≠' | '≤' | '≥';
export type TMathOperator = '*' | '+' | '/' | '=' | '-';

export type TVariableExpects = 'Да/Нет' | 'Строка' | 'Число';

export type TStoryStatus = 'draft' | 'published' | 'review';

export type TGenre = (typeof GENRES_LIST)[number]['id'];

export type TBoundings = ICoordinates & ISize;

export interface IStoryEditableInfo {
	color: TRGB;
	description: string;
	genre: TGenre;
	imageUrl?: null | string;
	tags: Array<string>;
	title: string;
}

export interface ISearched {
	authors: Array<IUser>;
	stories: Array<IStorySchema>;
}

export interface IStory extends IStoryEditableInfo {
	created: number;
	status: TStoryStatus;
	storyId: number;
}

interface IOperation {
	value: string;
	variable: string;
}

export interface ILogicOperation extends IOperation {
	symbol: TComparisonOperator;
}

export interface IMathOperation extends IOperation {
	symbol: TMathOperator;
}

export interface IChoice {
	choiceId: number;
	frameId: number;
	logicOperations: Array<ILogicOperation>;
	mathOperations: Array<IMathOperation>;
	text: string;
}

export interface IFrame {
	[index: string]: unknown;
	choices: Array<IChoice>;
	frameId: number;
	imageUrl: null | string;
	soundUrl: null | string;
	text: null | string;
}

export interface IVariable {
	expect: TVariableExpects;
	name: string;
	value: string;
}

export interface ICoordinates {
	x: number;
	y: number;
}

export interface ISize {
	height: number;
	width: number;
}

export interface IProgress {
	choiceId: number;
	frameId: number;
	nextFrameId?: number;
}

export interface IProgressData {
	choices: Array<IProgress>;
	readerId: number;
	started: number;
	storyId: number;
	version: number;
}

type IUserRole = 'admin' | 'member' | 'moderator';

export interface IUser {
	[index: string]: Array<number> | TRGB | null | number | string;
	color: TRGB | null;
	created: number;
	description: string;
	email: string;
	imageUrl: null | string;
	name: string;
	role: IUserRole;
	sessionId: null | string;
	subscriptions: Array<number>;
	userId: number;
}

export interface IResponseResult {
	error: boolean;
	text: string;
}
