import { redirect } from '@sveltejs/kit';

import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { ResponseStories } from '$lib/types/response';

import { randomError } from '$lib/utils/random';

export const load = async ({ fetch, locals, params }) => {
	const { linkName } = params;

	if (locals.session && locals.session.linkName === linkName) {
		redirect(302, '/profile');
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/users/${linkName}/stories`);
	const { error, message } = (await res.json()) as { error: boolean; message: ResponseStories };

	if (error) {
		randomError(404);
	}

	return message as ResponseStories;
};
