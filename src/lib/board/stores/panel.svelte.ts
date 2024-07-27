import type { Component } from 'svelte';

import type { PanelProps } from '$lib/types';

interface PrevPanelState {
	component: Component | null;
	id: string;
	props: PanelProps | null;
}

const getPanelStates = () => {
	let show = $state<boolean>(false);
	let editMode = $state<boolean>(false);
	let component = $state<Component | null>(null);
	let props = $state<PanelProps | null>(null);
	let id = $state<string>('');
	let prevPanel = $state<PrevPanelState | null>(null);

	const goBack = () => {
		if (!prevPanel) return;

		id = prevPanel.id;
		component = prevPanel.component;
		props = prevPanel.props;
		prevPanel = null;
	};

	const set = <T>(newId: string, newComponent: Component, newProps: PanelProps & T) => {
		prevPanel = null;

		if (newProps.isSubpanel) {
			prevPanel = {
				component,
				id,
				props
			};
		}

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
		goBack,
		get id() {
			return id;
		},
		get prevPanel() {
			return prevPanel;
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
