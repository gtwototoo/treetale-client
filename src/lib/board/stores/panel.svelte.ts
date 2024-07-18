import type { Component } from 'svelte';

import type { PanelProps } from '$lib/types';

const getPanelStates = () => {
	let show = $state<boolean>(false);
	let editMode = $state<boolean>(false);
	let component = $state<Component | null>(null);
	let props = $state<PanelProps | null>(null);
	let id = $state<string>('');

	const set = <T>(newId: string, newComponent: Component, newProps: PanelProps & T) => {
		id = newId;
		component = newComponent;
		props = newProps;
	};

	const clear = () => {
		show = false;
		editMode = false;
		component = null;
		props = null;
		id = '';
	};

	return {
		clear,
		get component() {
			return component;
		},
		get editMode() {
			return editMode;
		},
		set editMode(value) {
			editMode = value;
		},
		get id() {
			return id;
		},
		get props() {
			return props;
		},
		set,
		get show() {
			return show;
		},
		set show(value) {
			show = value;
		}
	};
};

export const panelStatesStore = getPanelStates();
