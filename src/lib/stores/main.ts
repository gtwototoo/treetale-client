import { DEFAULT_COLOR } from '$lib/constants';
import type { RGB } from '$lib/types';
import type { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';

interface IPanel {
	title?: string;
	id: string;
	component?: typeof SvelteComponent<unknown>;
}

const currentPanelCustomStore = () => {
	const clearData: IPanel = {
		title: '',
		id: '',
		component: undefined
	};
	const { subscribe, update } = writable<IPanel>(clearData);

	const setCurrentPanel = (data: IPanel) => {
		update((current) => {
			data.title = data.title === undefined ? data.id : data.title;

			return data.id === current.id ? clearData : data;
		});
	};

	const clearCurrentPanel = () => update(() => clearData);

	return {
		subscribe,
		clear: clearCurrentPanel,
		set: setCurrentPanel,
		update
	};
};

export const currentPanelStore = currentPanelCustomStore();
export const bodyColorStore = writable<RGB>(DEFAULT_COLOR);
