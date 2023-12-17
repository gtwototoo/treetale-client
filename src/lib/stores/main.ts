import type { SvelteComponent } from 'svelte';
import { derived, writable } from 'svelte/store';

import { DEFAULT_COLOR } from '$lib/constants';
import type { TRGB } from '$lib/types';
import { contrastText } from '$lib/utils';

export interface IPanel {
	component: typeof SvelteComponent<unknown>;
	editMode?: boolean;
	hasCloseButton?: boolean;
	hasEditButton?: boolean;
	hidden?: boolean;
	id: string;
	title: string;
}

const currentPanelCustomStore = () => {
	const clearData: IPanel = {
		title: '',
		id: '',
		component: undefined,
		editMode: false,
		hasEditButton: true,
		hasCloseButton: true,
		hidden: false
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

	const switchVisible = () =>
		update((current) => {
			current.hidden = !current.hidden;

			return current;
		});

	const clearCurrentPanel = () => update(() => clearData);

	return {
		subscribe,
		switchVisible,
		clear: clearCurrentPanel,
		set: setCurrentPanel,
		switchEditMode,
		update
	};
};

export const currentPanelStore = currentPanelCustomStore();
export const bodyColorStore = writable<TRGB>(DEFAULT_COLOR);
export const redColorStore = derived([bodyColorStore], ([$bodyColorStore]) => {
	return contrastText($bodyColorStore) ? 'bg-red-900' : 'bg-red-100';
});
