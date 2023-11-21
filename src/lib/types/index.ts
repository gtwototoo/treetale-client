export type TRGB = [number, number, number];

export type TComparisonOperator = '=' | '≥' | '≤' | '>' | '<' | '≠';
export type TMathOperator = '+' | '-' | '/' | '*' | '=';

export type TVariableExpects = 'Строка' | 'Число' | 'Да/Нет';

export interface IStoryEditableInfo {
	color: TRGB;
	description: string;
	draft: boolean;
	imageId?: string | null;
	tags: Array<string>;
	title: string;
}

export interface IStory extends IStoryEditableInfo {
	created: number;
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
	imageId: string | null;
	text: string | null;
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

export type TBoundings = ISize & ICoordinates;

export interface IProgressData {
	choices: Array<number>;
	frames: Array<IFrame>;
	readerId: number;
	started?: number;
	storyId: number;
	version: number;
}

export interface IUser {
	[index: string]: string | number | null | TRGB;
	avatarId: string | null;
	color: TRGB | null;
	created: number;
	description: string;
	email: string;
	name: string;
	sessionId: string | null;
	userId: number;
}
