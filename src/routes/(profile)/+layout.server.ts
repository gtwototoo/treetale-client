import { StoriesModel, UsersModel } from '$lib/server/models';
import { collapseValue, pluralize, randomError, serialize } from '$lib/utils';

import { USER_WITHOUT_WORKSPACE } from '$lib/constants.js';
import type { IUser } from '$lib/types';
import type { IStoryReading } from '$lib/types/reading';

const correctMetric = (value: number, names: [string, string, string]) => {
	return pluralize(Number(collapseValue(value).match(/\d+/)?.[0]), ...names).split(' ');
};

const getStatistic = async (stories: Array<IStoryReading>, user: IUser) => {
	const likes = stories.reduce((sum, { likes }) => sum + likes.length, 0);
	const subscribersCount = await UsersModel.find({
		subscriptions: {
			$in: [user.userId]
		}
	}).countDocuments();

	const metrics: Array<Array<string>> = [
		correctMetric(likes, ['лайков', 'лайк', 'лайка']),
		correctMetric(stories.length, ['историй', 'история', 'истории']),
		correctMetric(subscribersCount, ['подписчиков', 'подписчик', 'подписчика'])
	];

	return metrics;
};

export const load = async ({ params, locals }) => {
	let user: IUser | null;
	const { name } = params;

	if (name) {
		user = await UsersModel.findOne({
			name
		})
			.select({
				_id: 0,
				sessionId: 0
			})
			.lean();
	} else {
		user = locals.session;
	}

	if (!user) throw randomError(404);

	const stories = await StoriesModel.find({
		userId: user.userId
	})
		.select(USER_WITHOUT_WORKSPACE)
		.lean();

	if (!stories) throw randomError(404);

	return {
		user,
		statistic: await getStatistic(serialize(stories), serialize(user))
	};
};
