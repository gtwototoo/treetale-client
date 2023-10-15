import { DEFAULT_COLOR } from '$lib/constants';
import type { TRGB } from '$lib/types';
import type { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';

interface IPanel {
	title?: string;
	id: string;
	component?: typeof SvelteComponent<unknown>;
	editMode?: boolean;
	hasEditButton?: boolean;
}

const currentPanelCustomStore = () => {
	const clearData: IPanel = {
		title: '',
		id: '',
		component: undefined,
		editMode: false,
		hasEditButton: true
	};
	const { subscribe, update } = writable<IPanel>(clearData);

	const setCurrentPanel = (data: IPanel) => {
		update((current) => {
			data.title = data.title === undefined ? data.id : data.title;

			return data.id === current.id ? clearData : { ...clearData, ...data };
		});
	};

	const switchEditMode = () =>
		update((current) => {
			current.editMode = !current.editMode;

			return current;
		});

	const clearCurrentPanel = () => update(() => clearData);

	return {
		subscribe,
		clear: clearCurrentPanel,
		set: setCurrentPanel,
		switchEditMode,
		update
	};
};

export const currentPanelStore = currentPanelCustomStore();
export const bodyColorStore = writable<TRGB>(DEFAULT_COLOR);
