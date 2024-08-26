import type { HttpError } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { FetchResponse } from '$lib/types/response.js';

import { fetchPost } from '$lib/requests/index';
import { COOKIE_OPTIONS } from '$lib/server/constants';

interface ISessionInfo {
	sessionId: string;
}

export const load = async ({ cookies, params }) => {
	const { code } = params;

	try {
		const { message } = await fetchPost<FetchResponse<ISessionInfo>>(
			`${PUBLIC_TREETALE_API_URL}/me/session`,
			{
				code
			}
		);

		if (message.sessionId) {
			cookies.set('sessionId', message.sessionId, COOKIE_OPTIONS);

			redirect(302, '/');
		}

		return {};
	} catch (error) {
		const httpError = error as HttpError;

		if (httpError.status === 404) {
			redirect(302, '/');
		}
	}
};
