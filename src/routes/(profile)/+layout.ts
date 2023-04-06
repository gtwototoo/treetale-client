import Profile from '$lib/components/modules/Header/Profile.svelte';

export const load = async ({ data }) => {
	return {
		...data,
		header: Profile
	};
};
