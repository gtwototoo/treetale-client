import { redirect } from '@sveltejs/kit';

import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { ResponseStories } from '$lib/types/response';

export const load = async ({ fetch, locals }) => {
	const user = locals.session;

	if (!user) {
		redirect(302, '/');
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/me/stories?type=liked`);
	const userLikedStories = await res.json();

	return userLikedStories as ResponseStories;
};
