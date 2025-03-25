import type { Component } from 'svelte';

export interface IconProps {
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

export interface ChildrenSnippetProps {
	onclick?: () => void;
	icon?: Component;
	value: string;
}

type AlignedPlacement = `${Side}-${Alignment}`;
type Alignment = 'start' | 'end';
type Side = 'top' | 'right' | 'bottom' | 'left';

export type Placement = Prettify<Side | AlignedPlacement>;

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};
