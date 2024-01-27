import { redirect } from '@sveltejs/kit';

import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { IResponseStories } from '$lib/types/response.js';

export const load = async ({ fetch, locals }) => {
	const user = locals.session;

	if (!user) {
		throw redirect(302, '/');
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/me/stories?type=moderated`);
	const userModeratedStories = await res.json();

	return userModeratedStories as IResponseStories;
};
