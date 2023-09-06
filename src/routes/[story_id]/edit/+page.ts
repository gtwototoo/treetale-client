import EditingHeader from '$lib/components/modules/Header/EditingHeader.svelte';

export const load = ({ data }) => {
	return {
		...data,
		header: EditingHeader
	};
};
