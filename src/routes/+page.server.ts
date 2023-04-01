import { StoriesModel, UsersModel } from '$lib/server/models';
import type { IUser, IVariable } from '$lib/types';
import type { IStoryFull, IStoryReading } from '$lib/types/reading';
import type { IStorySchema } from '$lib/types/schemas';
import { serialize } from '$lib/utils';

export const load = async ({ locals }) => {
	const session = locals.session;
	const rawStories: IStorySchema[] = await StoriesModel.find({
		draft: false
	})
		.select({
			_id: 0,
			grabbingScale: 0,
			grabbingOffsets: 0,
			frames: 0
		})
		.skip(0)
		.limit(10)
		.lean();

	if (!rawStories) {
		return {
			stories: []
		};
	}

	const stories: IStoryFull[] = [];

	for (const story of rawStories) {
		const author = await UsersModel.findOne({
			userId: +story.userId
		});
		stories.push({
			...story,
			author: author ? serialize(author) : null
		} satisfies IStoryReading & {
			vars: IVariable[];
			author: IUser;
		});
	}

	return { stories };
};
