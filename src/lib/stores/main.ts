import Main from '$lib/components/modules/Header/Main.svelte';
import type { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';

interface IPanel {
	title?: string;
	id: string;
	component?: typeof SvelteComponent;
}

const currentPanelCustomStore = () => {
	const clearData: IPanel = {
		title: '',
		id: '',
		component: undefined
	};
	const { subscribe, update } = writable<IPanel>(clearData);

	return {
		subscribe,
		clear: () => update(() => clearData),
		set: (data: IPanel) =>
			update((current) => {
				data.title = data.title === undefined ? data.id : data.title;

				return data.id === current.id ? clearData : data;
			}),
		update
	};
};

export let currentPanel = currentPanelCustomStore();
export let currentHeader = writable<typeof SvelteComponent>(Main);
