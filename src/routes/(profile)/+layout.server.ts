import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { User } from '$lib/types/index';

import { randomError } from '$lib/utils/random';

interface IResponseStats {
	statistic: string[][];
	user: User;
}

export const load = async ({ fetch, params }) => {
	const { name } = params;

	const res = await fetch(
		name
			? `${PUBLIC_TREETALE_API_URL}/users/${name}/stats`
			: `${PUBLIC_TREETALE_API_URL}/me/stats`
	);
	const { error, ...data } = (await res.json()) as { error: boolean } & IResponseStats;

	if (error) {
		randomError(404);
	}

	return data as IResponseStats;
};
