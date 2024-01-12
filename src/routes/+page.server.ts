import { StoriesModel, UsersModel } from '$lib/server/models';
import { collapseValue, pluralize } from '$lib/utils';

import { USER_WITHOUT_WORKSPACE } from '$lib/constants.js';
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

const STORIES_LIMIT = 10;

const correctMetric = (value: number, names: [string, string, string]) => {
	const collapsed = collapseValue(value);

	return [collapsed, pluralize(+collapsed.match(/\d+/)?.[0], ...names)];
};

const getStatistic = async () => {
	const totalStories = await StoriesModel.aggregate([
		{
			$match: {
				status: 'published'
			}
		},
		{
			$group: {
				_id: null,
				totalLikes: { $sum: { $size: '$likes' } },
				totalStories: { $sum: 1 }
			}
		}
	]);
	const totalUsers = await UsersModel.countDocuments();

	return [
		['users', ...correctMetric(totalUsers, ['читателей', 'читатель', 'читателя'])],
		['likes', ...correctMetric(totalStories[0].totalLikes, ['лайков', 'лайк', 'лайка'])],
		['stories', ...correctMetric(totalStories[0].totalStories, ['историй', 'история', 'истории'])]
	] as Array<['users' | 'stories' | 'likes', string, string]>;
};

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
			.limit(STORIES_LIMIT)
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

	return {
		categories: categoryStories,
		authors: await loadUsers(concatStories),
		statistic: await getStatistic()
	};
};
