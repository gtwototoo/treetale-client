// import { collapseValue, pluralize } from '$lib/utils';

import { StoriesModel, UsersModel } from '$lib/server/models';
import type { IUser } from '$lib/types';
import type { IStoryReading } from '$lib/types/reading';
import { collapseValue, pluralize, randomError } from '$lib/utils';

const correctMetric = (value: number, names: [string, string, string]) => {
	return pluralize(Number(collapseValue(value).match(/\d+/)?.[0]), ...names).split(' ');
};

const getStatistic = (stories: IStoryReading[]) => {
	const likes = stories.reduce((sum, { likes }) => sum + likes.length, 0);

	const metrics: string[][] = [
		correctMetric(stories.length, ['историй', 'история', 'истории']),
		correctMetric(0, ['подписчиков', 'подписчик', 'подписчика']),
		correctMetric(likes, ['лайков', 'лайк', 'лайка'])
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
	}).select({
		_id: 0,
		grabbingScale: 0,
		grabbingOffsets: 0,
		frames: 0
	});

	if (!stories) throw randomError(404);

	return {
		user,
		statistic: getStatistic(stories)
	};
};
