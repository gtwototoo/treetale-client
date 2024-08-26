import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { Story, User } from '$lib/types';
import type { FetchResponse } from '$lib/types/response.js';

import { randomError } from '$lib/utils/random';

interface ICategory {
	id: string;
	stories: Story[];
	title: string;
}

interface ResponseMainInfo {
	authors: ({ subscribersCount: number } & User)[];
	categories: ICategory[];
	statistic: { id: 'likes' | 'stories' | 'users'; title: string; value: string }[];
}

export const load = async ({ fetch }) => {
	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/main`);
	const { error, message } = (await res.json()) as FetchResponse<ResponseMainInfo>;

	if (error) {
		randomError(500);
	}

	return message;
};
