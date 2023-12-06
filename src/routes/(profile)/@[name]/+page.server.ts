import { StoriesModel, UsersModel } from '$lib/server/models';
import { randomError, serialize } from '$lib/utils';

import { USER_WITHOUT_WORKSPACE } from '$lib/constants.js';
import type { IUser } from '$lib/types';
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

	const stories = await StoriesModel.find({
		userId: user.userId,
		draft: false
	})
		.select(USER_WITHOUT_WORKSPACE)
		.lean();

	return {
		stories: serialize(stories),
		authors: [serialize(user)]
	};
};
