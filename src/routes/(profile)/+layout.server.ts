// import { collapseValue, pluralize } from '$lib/utils';

import { UsersModel } from '$lib/server/models';
import type { IUser } from '$lib/types';
import { randomError } from '$lib/utils';

// interface IMetric {
// 	value: number;
// 	name: [string, string, string];
// }

// const getStatistic = () => {
// 	const metrics: IMetric[] = [
// 		{
// 			value: $storiesStore.length,
// 			name: ['историй', 'история', 'истории']
// 		},
// 		{ value: 0, name: ['подписчиков', 'подписчик', 'подписчика'] },
// 		{
// 			value: $storiesStore.reduce((sum, { likes }) => sum + likes.length, 0),
// 			name: ['лайков', 'лайк', 'лайка']
// 		}
// 	];

// 	return metrics.map(({ name, value }) =>
// 		pluralize(Number(collapseValue(value).match(/\d+/)?.[0]), ...name)
// 	);
// };

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

	return {
		user,
		statistic: []
	};
};
