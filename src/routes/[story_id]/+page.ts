import Reading from '$lib/components/modules/Header/Reading.svelte';

export const load = ({ data }) => {
	return {
		...data,
		header: Reading
	};
};
