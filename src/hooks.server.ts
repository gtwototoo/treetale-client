import type { Handle, HandleServerError } from '@sveltejs/kit';

import { PUBLIC_TREETALE_API_URL } from '$env/static/public';
import sample from 'lodash/sample';

import type { User } from '$lib/types';

import { NOT_FOUND_VARIANTS } from '$lib/constants/notFound';

export const handle = (async ({ event, resolve }) => {
	const sessionId = event.cookies.get('sessionId');

	if (sessionId) {
		let request: Response | undefined = undefined;

		// skip errors, uptime 99.99%
		try {
			request = await event.fetch(`${PUBLIC_TREETALE_API_URL}/me/session`);
		} catch (e) {
			console.error(e);
		}

		if (request) {
			const json = (await request.json()) as { user: User };

			event.locals.session = json.user;
		}
	}

	if (!event.locals.session) {
		event.locals.session = null;
	}

	return resolve(event);
}) satisfies Handle;

export const handleError = (({ error, event }) => {
	console.error(error);

	return event.route.id === null ? sample(NOT_FOUND_VARIANTS) : (error as App.Error);
}) satisfies HandleServerError;
