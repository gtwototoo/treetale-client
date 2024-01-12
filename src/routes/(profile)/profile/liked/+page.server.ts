import { PUBLIC_TREETALE_API_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, fetch }) => {
	const user = locals.session;

	if (!user) {
		throw redirect(302, '/');
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/user/stories/liked`);
	const userLikedStories = await res.json();

	return userLikedStories;
};
