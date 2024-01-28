import { redirect } from '@sveltejs/kit';

import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { IResponseStories } from '$lib/types/response.js';

export const load = async ({ fetch, locals, params }) => {
	const { name } = params;

	if (locals.session && locals.session.name === name) {
		redirect(302, '/profile');
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/users/${name}/stories`);
	const userStories = await res.json();

	return userStories as IResponseStories;
};
