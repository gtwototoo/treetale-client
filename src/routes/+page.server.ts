import { USER_WITHOUT_WORKSPACE } from '$lib/constants.js';
import { StoriesModel } from '$lib/server/models';
import { loadUsers } from '$lib/server/utils';
import type { IStorySchema } from '$lib/types/schemas';

export const load = async () => {
	const newStories: Array<IStorySchema> = await StoriesModel.find({
		draft: false
	})
		.select(USER_WITHOUT_WORKSPACE)
		.skip(0)
		.limit(10)
		.sort({
			created: 'desc'
		})
		.lean();

	const darkStories: Array<IStorySchema> = await StoriesModel.find({
		draft: false,
		darkTheme: true
	})
		.select(USER_WITHOUT_WORKSPACE)
		.skip(0)
		.limit(10)
		.sort({
			created: 'desc'
		})
		.lean();

	const lightStories: Array<IStorySchema> = await StoriesModel.find({
		draft: false,
		darkTheme: false
	})
		.select(USER_WITHOUT_WORKSPACE)
		.skip(0)
		.limit(10)
		.sort({
			created: 'desc'
		})
		.lean();

	const stories: Record<string, Array<IStorySchema>> = {
		newStories,
		darkStories,
		lightStories
	};

	const concatStories = [].concat(...Object.values(stories));

	return { stories, authors: await loadUsers(concatStories) };
};
