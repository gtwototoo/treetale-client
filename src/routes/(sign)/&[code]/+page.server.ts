import { type HttpError, redirect } from '@sveltejs/kit';

import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import { fetchPost } from '$lib/requests/index.js';
import { COOKIE_OPTIONS } from '$lib/server/constants.js';

interface ISessionInfo {
	sessionId: string;
}

export const load = async ({ cookies, params }) => {
	const { code } = params;

	let response;

	try {
		response = await fetchPost<ISessionInfo>(`${PUBLIC_TREETALE_API_URL}/me/session`, {
			code
		});
	} catch (e) {
		const error = e as HttpError;

		if (error.status === 404) {
			redirect(302, '/');
		}
	}

	if (!response.sessionId) {
		return {};
	}

	cookies.set('sessionId', response.sessionId, COOKIE_OPTIONS);

	redirect(302, '/');
};
