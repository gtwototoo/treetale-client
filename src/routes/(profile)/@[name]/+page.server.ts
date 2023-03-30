import { StoriesModel, UsersModel } from '$lib/server/models';
import type { IUser, IVariable } from '$lib/types';
import type { IStoryFull, IStoryReading } from '$lib/types/reading';
import { randomError, serialize } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
	const { name } = params;

	if (locals.session && locals.session.name === name) throw redirect(302, '/profile');

	const user: IUser | null = await UsersModel.findOne({
		name
	})
		.select({
			_id: 0,
			sessionId: 0
		})
		.lean();

	if (!user) throw randomError(404);

	const rawStories = await StoriesModel.find({
		userId: user.userId
	})
		.select({
			_id: 0,
			grabbingScale: 0,
			grabbingOffsets: 0
		})
		.lean();

	const stories: IStoryFull[] = [];

	for (const story of rawStories) {
		const author = await UsersModel.findOne({
			userId: story.userId
		})
			.select({
				_id: 0,
				sessionId: 0
			})
			.lean();

		stories.push({
			...story,
			author: author ? serialize(author) : null
		} satisfies IStoryReading & {
			vars: IVariable[];
			author: IUser;
		});
	}

	return {
		user: serialize(user),
		stories: serialize(stories)
	};
};
