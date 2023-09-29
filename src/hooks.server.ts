import { PUBLIC_TREETALE_API_URL } from '$env/static/public';
import type { Handle, HandleServerError } from '@sveltejs/kit';

import { NOT_FOUND_VARIANTS } from '$lib/constants';
import { mongooseConnect } from '$lib/server/mongoose';
import { randomArray } from '$lib/utils';

export const handle = (async ({ event, resolve }) => {
	await mongooseConnect();

	const sessionId = event.cookies.get('sessionId');

	if (sessionId) {
		let request: Response | undefined = undefined;

		// skip errors, uptime 99.99%
		try {
			request = await event.fetch(`${PUBLIC_TREETALE_API_URL}/session`);
		} catch (e) {
			console.error(e);
		}

		if (request) {
			const json = await request.json();

			event.locals.session = json.user;
		}
	}

	if (!event.locals.session) {
		event.locals.session = null;
	}

	return resolve(event);
}) satisfies Handle;

export const handleError = (({ event, error }) => {
	console.error(error);

	return event.route.id === null ? randomArray(NOT_FOUND_VARIANTS) : (error as App.Error);
}) satisfies HandleServerError;
