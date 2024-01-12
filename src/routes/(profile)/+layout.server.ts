import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

export const load = async ({ fetch, params }) => {
	const { name } = params;

	const res = await fetch(
		name
			? `${PUBLIC_TREETALE_API_URL}/user/stats/${name}`
			: `${PUBLIC_TREETALE_API_URL}/user/stats/`
	);
	const userStatistic = await res.json();

	return userStatistic;
};
