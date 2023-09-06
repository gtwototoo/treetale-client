import ReadingHeader from '$lib/components/modules/Header/ReadingHeader.svelte';

export const load = ({ data }) => {
	return {
		...data,
		header: ReadingHeader
	};
};
