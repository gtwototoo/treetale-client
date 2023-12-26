import { USER_WITHOUT_WORKSPACE } from '$lib/constants.js';
import { StoriesModel } from '$lib/server/models';
import { loadUsers } from '$lib/server/utils';
import type { IStorySchema } from '$lib/types/schemas';
import type { FilterQuery } from 'mongoose';

interface ICategory {
	filter: FilterQuery<IStorySchema>;
	id: string;
	title: string;
}

interface IReadyCategory extends Omit<ICategory, 'filter'> {
	stories: Array<IStorySchema>;
}

const LIMIT = 10;

export const load = async () => {
	const categories: Array<ICategory> = [
		{
			id: 'news',
			title: 'Новинки',
			filter: {}
		},
		{
			id: 'dark_theme',
			title: 'Темная тема',
			filter: {
				darkTheme: true
			}
		},
		{
			id: 'light_theme',
			title: 'Светлая тема',
			filter: {
				darkTheme: false
			}
		}
	];

	const categoryStories: Array<IReadyCategory> = [];

	for (const { title, filter, id } of categories) {
		const stories = await StoriesModel.find({
			status: 'published',
			...filter
		})
			.select(USER_WITHOUT_WORKSPACE)
			.skip(0)
			.limit(LIMIT)
			.sort({
				created: 'desc'
			})
			.lean();

		if (!stories || !stories.length) continue;

		categoryStories.push({
			id,
			title,
			stories
		});
	}

	const concatStories = [].concat(...categoryStories.map(({ stories }) => stories));

	return { categories: categoryStories, authors: await loadUsers(concatStories) };
};
