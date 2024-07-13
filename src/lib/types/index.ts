import type { GENRES_LIST } from '$lib/constants/genres';
import type { SvelteComponent } from 'svelte';

export type RGB = [number, number, number];
export type UserRole = 'admin' | 'member' | 'moderator';

export interface StartMoveParams {
	moveFrameOffset: Coordinates;
	moveXDirection: boolean | null;
	startMoveCoords: Coordinates;
}

export interface Progress {
	choiceId: number;
	frameId: number;
	nextFrameId?: number;
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

export type Bounding = Sizes & Coordinates;

export type StoryTag = string;

export type Genre = (typeof GENRES_LIST)[number]['id'];

export type StoryStatus = 'draft' | 'published' | 'review';

export interface Story {
	vars: Variable[];
	userId: number;
	color: RGB;
	description: string;
	genre: Genre;
	imageUrl: null | string;
	tags: StoryTag[];
	title: string;
	created: number;
	status: StoryStatus;
	storyId: number;
	version: number;
	likes: number[];
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
	title: string;
	isEdit?: boolean;
	[key: string]: unknown;
}

export type VariableExpects = 'Логика' | 'Строка' | 'Число';

export interface Variable {
	expect: VariableExpects;
	name: string;
	value: string;
}

interface IconProps {
	size?: string;
	role?: string;
	color?: string;
	variation?: 'solid' | 'outline' | 'mini' | 'micro';
	strokeWidth?: string;
	withEvents?: boolean;
	onclick?: (event: MouseEvent) => void;
	onkeydown?: (event: KeyboardEvent) => void;
	onkeyup?: (event: KeyboardEvent) => void;
	class?: string;
	title?: {
		id?: string;
		title?: string;
	};
	desc?: {
		id?: string;
		desc?: string;
	};
	ariaLabel?: string;
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
	value: string;
	variable: string;
	symbol: T;
}

export type LogicOperation = Operation<ComparisonOperators>;
export type MathOperation = Operation<MathOperators>;

export interface Choice {
	choiceId: number;
	frameId: number | null;
	logicOperations: LogicOperation[];
	mathOperations: MathOperation[];
	text: string;
}

export interface Frame extends Coordinates, Pick<Sizes, 'height'> {
	hidden: boolean;
	title: string;
	isEnd: boolean;
	isStart: boolean;
	choices: Choice[];
	frameId: number;
	imageUrl: null | string;
	soundUrl: null | string;
	text: null | string;
}
