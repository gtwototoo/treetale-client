import { PUBLIC_TREETALE_API_URL } from '$env/static/public';
import type { IUser } from '$lib/types/index.js';

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
	const userStatistic = await res.json();

	return userStatistic as IResponseStats;
};
