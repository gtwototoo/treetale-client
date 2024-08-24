import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { User } from '$lib/types/index';

import { randomError } from '$lib/utils/random';

interface ResponseStats {
	statistic: string[][];
	user: User;
}

export const load = async ({ fetch, params }) => {
	const { linkName } = params;

	const res = await fetch(
		linkName
			? `${PUBLIC_TREETALE_API_URL}/users/${linkName}/stats`
			: `${PUBLIC_TREETALE_API_URL}/me/stats`
	);
	const { error, message } = (await res.json()) as { error: boolean; message: ResponseStats };

	if (error) {
		randomError(404);
	}

	return message;
};
