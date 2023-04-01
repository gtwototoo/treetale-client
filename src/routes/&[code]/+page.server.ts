import { PUBLIC_TREESTORY_API_URL } from '$env/static/public';
import { COOKIE_OPTIONS } from '$lib/server/constants';
import { redirect } from '@sveltejs/kit';

export const load = async ({ fetch, params, cookies }) => {
	const { code } = params;
	// fetchPost

	const request = await fetch(`${PUBLIC_TREESTORY_API_URL}/session`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			code
		})
	});

	if (request.status === 404) {
		throw redirect(302, '/');
	}

	const { sessionId } = await request.json();

	if (!sessionId) {
		return {};
	}

	cookies.set('sessionId', sessionId, COOKIE_OPTIONS);

	throw redirect(302, '/');
};
