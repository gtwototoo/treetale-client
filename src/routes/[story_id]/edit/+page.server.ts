import { notFoundVariants } from '$lib/constants';
import { StoriesModel } from '$lib/server/models';
import type { IStorySchema } from '$lib/types/schemas';
import { randomArray, serialize } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = locals.session;
	const storyId = +params.story_id;

	if (!user) throw redirect(302, '/signin');

	const story: IStorySchema | null = await StoriesModel.findOne({
		storyId,
		userId: user.userId
	});

	if (!story) {
		throw error(404, randomArray(notFoundVariants));
	}

	return {
		story: serialize(story)
	};
};
