import { PUBLIC_TREETALE_API_URL } from '$env/static/public';
import type { IResponseStories } from '$lib/types/response.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, params, fetch }) => {
	const { name } = params;

	if (locals.session && locals.session.name === name) {
		throw redirect(302, '/profile');
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/users/${name}/stories`);
	const userStories = await res.json();

	return userStories as IResponseStories;
};
