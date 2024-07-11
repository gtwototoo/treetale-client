import ProfileHeader from '$lib/components/Header/ProfileHeader.svelte';

export const load = async ({ data }) => {
	return {
		...data,
		header: ProfileHeader
	};
};
