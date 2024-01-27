import type { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';

export interface IPanel {
	component: typeof SvelteComponent<unknown>;
	id: string;
}

const panelCustomStore = () => {
	const clearData: IPanel = {
		component: undefined,
		id: ''
	};
	const { subscribe, update } = writable<IPanel>(clearData);

	const setPanel = (data: IPanel) => {
		update((current) => {
			return data.id === current.id ? clearData : { ...clearData, ...data };
		});
	};

	const clearPanel = () => update(() => clearData);

	return {
		clear: clearPanel,
		set: setPanel,
		subscribe,
		update
	};
};

export const panelStore = panelCustomStore();
export const panelEditMode = writable(false);
export const panelShow = writable(false);
