import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { IUser } from '$lib/types/index.js';
import type { IStorySchema } from '$lib/types/schemas.js';

import { randomError } from '$lib/utils/random.js';

interface ICategory {
	id: string;
	stories: Array<IStorySchema>;
	title: string;
}

interface IResponseMainInfo {
	authors: Array<IUser>;
	categories: Array<ICategory>;
	statistic: Array<{ id: 'likes' | 'stories' | 'users'; title: string; value: string }>;
}

export const load = async ({ fetch }) => {
	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/main`);
	const { error, ...data } = (await res.json()) as { error: boolean } & IResponseMainInfo;

	if (error) {
		randomError(500);
	}

	return data as IResponseMainInfo;
};
