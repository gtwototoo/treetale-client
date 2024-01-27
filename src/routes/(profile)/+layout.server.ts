import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { IUser } from '$lib/types/index.js';

import { randomError } from '$lib/utils/random.js';

interface IResponseStats {
	statistic: Array<Array<string>>;
	user: IUser;
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
		throw randomError(404);
	}

	return data as IResponseStats;
};
