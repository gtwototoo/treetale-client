import type { HttpError } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { FetchResponse } from '$lib/types/response.js';

import { fetchPost } from '$lib/requests/index.js';
import { COOKIE_OPTIONS } from '$lib/server/constants';

interface SessionInfo {
	sessionId: string;
}

export const load = async ({ cookies, params }) => {
	const { code } = params;

	let fetchMessage = null;

	try {
		const { message } = await fetchPost<FetchResponse<SessionInfo>>(
			`${PUBLIC_TREETALE_API_URL}/me/session`,
			{
				code
			}
		);

		if (message.sessionId) {
			cookies.set('sessionId', message.sessionId, COOKIE_OPTIONS);
		}

		fetchMessage = message;
	} catch (error) {
		const httpError = error as HttpError;

		console.error(httpError);

		redirect(302, '/');
	}

	if (fetchMessage.sessionId) {
		return redirect(302, '/');
	} else {
		return {};
	}
};
