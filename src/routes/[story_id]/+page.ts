import ReadingHeader from '$lib/components/Header/ReadingHeader.svelte';

export const load = ({ data }) => {
	return {
		...data,
		header: ReadingHeader
	};
};
