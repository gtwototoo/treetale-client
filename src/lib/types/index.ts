export type TRGB = [number, number, number];

export type TComparisonOperator = '=' | '≥' | '≤' | '>' | '<' | '≠';
export type TMathOperator = '+' | '-' | '/' | '*' | '=';

export interface IStoryEditableInfo {
	title: string;
	description: string;
	tags: string[];
	imageId?: string | null;
	color: TRGB;
	draft: boolean;
}

export interface IStory extends IStoryEditableInfo {
	storyId: number;
	created: number;
}

interface IOperation {
	variable: string;
	value: string;
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
	text: string;
	logicOperations?: ILogicOperation[];
	mathOperations?: IMathOperation[];
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

export interface ISize {
	width: number;
	height: number;
}

export type TBoundings = ISize & ICoordinates;

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
	description: string;
	name: string;
	avatarId: string | null;
	created: number;
	color: TRGB | null;
	[index: string]: string | number | null | TRGB;
}
