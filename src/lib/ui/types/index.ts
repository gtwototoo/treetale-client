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

export interface ListItemProps {
	onclick?: () => void;
	icon?: Component;
	title: string;
}
