import ProfileHeader from '$lib/components/modules/Header/ProfileHeader.svelte';

export const load = async ({ data }) => {
	return {
		...data,
		header: ProfileHeader
	};
};
