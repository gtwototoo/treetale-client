import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { Story, User } from '$lib/types';

import { randomError } from '$lib/utils/random';

interface ICategory {
	id: string;
	stories: Story[];
	title: string;
}

interface IResponseMainInfo {
	authors: User[];
	categories: ICategory[];
	statistic: { id: 'likes' | 'stories' | 'users'; title: string; value: string }[];
}

export const load = async ({ fetch }) => {
	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/main`);
	const { error, ...data } = (await res.json()) as { error: boolean } & IResponseMainInfo;

	if (error) {
		randomError(500);
	}

	return data as IResponseMainInfo;
};
