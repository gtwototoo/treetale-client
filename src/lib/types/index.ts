import type { Component } from 'svelte';

export type RGB = [number, number, number];
export type UserRole = 'admin' | 'member' | 'moderator';

export interface StartMoveParams {
	moveFrameOffset: Coordinates;
	moveXDirection: boolean | null;
	startMoveCoords: Coordinates;
}

export interface ProgressChoices {
	choiceId: number;
	frameId: number;
	nextFrameId?: number;
}

export interface StartConnectParams {
	choiceId: number;
	frameId: number;
}

export type StoryEditableInfo = Pick<
	Story,
	'color' | 'description' | 'format' | 'genre' | 'tags' | 'title'
>;

export interface User {
	color: RGB | null;
	created: number;
	description: string;
	email: string;
	imageUrl: null | string;
	linkName: string;
	name: string;
	role: UserRole;
	sessionId: null | string;
	subscriptions: number[];
	userId: number;
}

export interface ConnectPath {
	connectId: string;
	line: string;
}

export interface FormatValues {
	description: string;
	icon: Component;
	id: StoryFormat;
	title: string;
}

export interface Genre {
	icon: Component;
	id: string;
	title: string;
}

export type Bounding = Coordinates & Sizes;

export type StoryTag = string;

export type StoryStatus = 'draft' | 'published' | 'review';

export type StoryFormat = 'canvas' | 'frames' | 'novella';

export interface Story {
	color: RGB;
	created: number;
	description: string;
	format: StoryFormat;
	genre: string;
	imageUrl: null | string;
	likes: number[];
	published: number;
	status: StoryStatus;
	storyId: number;
	tags: StoryTag[];
	title: string;
	updated: number;
	userId: number;
	vars: Variable[];
	version: string;
}

export interface Note {
	tags: StoryTag[];
	text: string;
}

export interface Searched {
	authors: ({ subscribersCount: number } & User)[];
	stories: Story[];
}

export interface PanelProps {
	[key: string]: unknown;
	isEdit?: boolean;
	isSubpanel?: boolean;
	title: string;
}

export interface Modificator<T = ComparisonOperators | MathOperators> {
	choiceId?: number;
	modificatorId: number;
	symbol: T;
	type: 'logic' | 'math';
	value: string;
	variable: string;
}

export type VariableExpects = 'Логика' | 'Строка' | 'Число';

export interface Variable {
	expect: VariableExpects;
	name: string;
	value: string;
}

export interface Coordinates {
	x: number;
	y: number;
}

export interface Sizes {
	height: number;
	width: number;
}

export type ComparisonOperators = '<' | '=' | '>' | '≠' | '≤' | '≥';
export type MathOperators = '*' | '+' | '/' | '=' | '-';

export type LogicModificator = Modificator<ComparisonOperators>;
export type MathModificator = Modificator<MathOperators>;

export interface Choice {
	asInput: boolean;
	choiceId: number;
	frameId: null | number;
	inputText?: string;
	text: string;
}

export interface Comment extends Coordinates, Sizes {
	commentId: number;
	text: string;
}

export interface Frame extends Coordinates, Pick<Sizes, 'height'> {
	choices: Choice[];
	frameId: number;
	hidden: boolean;
	imageUrl: null | string;
	isEnd: boolean;
	isStart: boolean;
	modificators: Modificator[];
	soundUrl: null | string;
	text: null | string;
	title: string;
}
