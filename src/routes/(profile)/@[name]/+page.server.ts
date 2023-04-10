import { USER_WITHOUT_WORKSPACE } from '$lib/constants.js';
import { StoriesModel, UsersModel } from '$lib/server/models';
import type { IUser } from '$lib/types';
import type { IStoryFull } from '$lib/types/reading';
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
		.select(USER_WITHOUT_WORKSPACE)
		.lean();

	const stories: IStoryFull[] = rawStories.map((story) => ({
		...story,
		author: serialize(user)
	}));

	return {
		stories: serialize(stories)
	};
};
