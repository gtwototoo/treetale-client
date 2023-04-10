import Editing from '$lib/components/modules/Header/Editing.svelte';

export const load = ({ data }) => {
	return {
		...data,
		header: Editing
	};
};
