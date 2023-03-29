import type { SvelteComponent } from 'svelte';
import { writable, type Writable } from 'svelte/store';

interface IPanel {
	title?: string;
	id: string;
	component?: typeof SvelteComponent;
}

const currentPanelCustomStore = () => {
	const clearData = {
		title: '',
		id: '',
		component: undefined
	};
	const { subscribe, update }: Writable<IPanel> = writable<IPanel>(clearData);

	return {
		subscribe,
		clear: () => update(() => clearData),
		set: (data: IPanel) =>
			update((current) => {
				data.title = data.title || data.id;

				return data.id === current.id ? clearData : data;
			}),
		update
	};
};

export let currentPanel = currentPanelCustomStore();
export let currentPage = writable<string>();
