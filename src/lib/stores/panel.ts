import type { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';

export interface IPanel {
	component: typeof SvelteComponent<unknown>;
	hidden?: boolean;
	id: string;
	title: string;
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
			data.title = data.title || data.id;

			return data.id === current.id ? clearData : { ...clearData, ...data };
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
export const panelEditMode = writable(false);
export const panelShow = writable(false);
