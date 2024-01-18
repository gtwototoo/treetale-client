import { PUBLIC_TREETALE_API_URL } from '$env/static/public';
import type { IResponseStories } from '$lib/types/response.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, fetch }) => {
	const user = locals.session;

	if (!user) {
		throw redirect(302, '/');
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/me/stories?type=liked`);
	const userLikedStories = await res.json();

	return userLikedStories as IResponseStories;
};
