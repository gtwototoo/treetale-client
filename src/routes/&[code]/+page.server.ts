import { PUBLIC_TREETALE_API_URL } from '$env/static/public';
import { fetchPost } from '$lib/requests/index.js';
import { COOKIE_OPTIONS } from '$lib/server/constants';
import { HttpError, redirect } from '@sveltejs/kit';

export const load = async ({ params, cookies }) => {
	const { code } = params;

	try {
		const response = await fetchPost<{ sessionId: string }>(
			`${PUBLIC_TREETALE_API_URL}/session`,
			{
				code
			}
		);

		if (!response.sessionId) {
			return {};
		}

		cookies.set('sessionId', response.sessionId, COOKIE_OPTIONS);

		throw redirect(302, '/');
	} catch (e) {
		const error = e as HttpError;

		if (error.status === 404) {
			throw redirect(302, '/');
		}
	}
};
