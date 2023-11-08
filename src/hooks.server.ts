import type { Handle, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as documentHandle } from '@sveltekit-addons/document/hooks';

import { PUBLIC_TREETALE_API_URL } from '$env/static/public';
import { NOT_FOUND_VARIANTS } from '$lib/constants';
import { mongooseConnect } from '$lib/server/mongoose';
import { randomArray } from '$lib/utils';

const defaultHandle = (async ({ event, resolve }) => {
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

export const handle = sequence(defaultHandle, documentHandle);

export const handleError = (({ event, error }) => {
	console.error(error);

	return event.route.id === null ? randomArray(NOT_FOUND_VARIANTS) : (error as App.Error);
}) satisfies HandleServerError;
