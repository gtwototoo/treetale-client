import type { IProgressData } from '$lib/types/index.js';
import type { IStoryFull } from '$lib/types/reading.js';
import { ProgressModel } from '$lib/server/models/progress.js';
import { StoriesModel } from '$lib/server/models/stories.js';
import { USER_WITHOUT_WORKSPACE } from '$lib/constants.js';
import { loadUsers } from '$lib/server/utils.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const user = locals.session;

	if (!user) throw redirect(302, '/');

	const progresses: Array<IProgressData> = await ProgressModel.find({
		readerId: user.userId
	})
		.select({
			_id: 0
		})
		.lean();

	const stories: Array<IStoryFull> = await StoriesModel.find({
		storyId: {
			$in: progresses.map(({ storyId }) => storyId)
		}
	})
		.select(USER_WITHOUT_WORKSPACE)
		.lean();

	return {
		stories,
		authors: loadUsers(stories)
	};
};
