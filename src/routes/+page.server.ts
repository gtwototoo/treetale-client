import { PUBLIC_TREETALE_API_URL } from '$env/static/public';
import type { IUser } from '$lib/types/index.js';
import type { IStorySchema } from '$lib/types/schemas.js';
import { randomError } from '$lib/utils/random.js';
import type { FilterQuery } from 'mongoose';

interface ICategory {
	filter: FilterQuery<IStorySchema>;
	id: string;
	title: string;
}

interface IReadyCategory extends Omit<ICategory, 'filter'> {
	stories: Array<IStorySchema>;
}

interface IResponseMainInfo {
	authors: Array<IUser>;
	categories: Array<IReadyCategory>;
	statistic: Array<Array<string>>;
}

export const load = async ({ fetch }) => {
	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/main`);
	const { error, ...data } = (await res.json()) as { error: boolean } & IResponseMainInfo;

	if (error) {
		throw randomError(500);
	}

	return data as IResponseMainInfo;
};
