import EditingHeader from '$lib/components/modules/Header/EditingHeader.svelte';

export let ssr = false;

export const load = ({ data }) => {
	return {
		...data,
		header: EditingHeader
	};
};
