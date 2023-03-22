import { writable, type Writable } from 'svelte/store';

const customStore = () => {
	const { subscribe, update }: Writable<string> = writable('');

	return {
		subscribe,
		set: (value: string) => update((n) => (n === value ? '' : value)),
		update
	};
};

export let currentPanel = customStore();
