import type { SvelteComponent } from 'svelte';

import type { GENRES_LIST } from '$lib/constants/genres';

export type RGB = [number, number, number];
export type UserRole = 'admin' | 'member' | 'moderator';

export interface StartMoveParams {
	moveFrameOffset: Coordinates;
	moveXDirection: boolean | null;
	startMoveCoords: Coordinates;
}

export interface StartConnectParams {
	choiceId: number;
	frameId: number;
}

export interface StoryEditableInfo {
	color: RGB;
	description: string;
	genre: Genre;
	imageUrl?: null | string;
	tags: StoryTag[];
	title: string;
}

export interface User {
	color: RGB | null;
	created: number;
	description: string;
	email: string;
	imageUrl: null | string;
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

export type Bounding = Coordinates & Sizes;

export type StoryTag = string;

export type Genre = (typeof GENRES_LIST)[number]['id'];

export type StoryStatus = 'draft' | 'published' | 'review';

export interface Story {
	color: RGB;
	created: number;
	description: string;
	genre: Genre;
	imageUrl: null | string;
	likes: number[];
	status: StoryStatus;
	storyId: number;
	tags: StoryTag[];
	title: string;
	userId: number;
	vars: Variable[];
	version: number;
}

export interface Note {
	tags: StoryTag[];
	text: string;
}

export interface Searched {
	authors: User[];
	stories: Story[];
}

export interface PanelProps {
	[key: string]: unknown;
	isEdit?: boolean;
	title: string;
}

export type VariableExpects = 'Логика' | 'Строка' | 'Число';

export interface Variable {
	expect: VariableExpects;
	name: string;
	value: string;
}

interface IconProps {
	ariaLabel?: string;
	class?: string;
	color?: string;
	desc?: {
		desc?: string;
		id?: string;
	};
	onclick?: (event: MouseEvent) => void;
	onkeydown?: (event: KeyboardEvent) => void;
	onkeyup?: (event: KeyboardEvent) => void;
	role?: string;
	size?: string;
	strokeWidth?: string;
	title?: {
		id?: string;
		title?: string;
	};
	variation?: 'micro' | 'mini' | 'outline' | 'solid';
	withEvents?: boolean;
}

export type HeroIconComponent = typeof SvelteComponent<IconProps>;

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

interface Operation<T> {
	symbol: T;
	value: string;
	variable: string;
}

export type LogicOperation = Operation<ComparisonOperators>;
export type MathOperation = Operation<MathOperators>;

export interface Choice {
	choiceId: number;
	frameId: null | number;
	logicOperations: LogicOperation[];
	mathOperations: MathOperation[];
	text: string;
}

export interface Frame extends Coordinates, Pick<Sizes, 'height'> {
	choices: Choice[];
	frameId: number;
	hidden: boolean;
	imageUrl: null | string;
	isEnd: boolean;
	isStart: boolean;
	soundUrl: null | string;
	text: null | string;
	title: string;
}
