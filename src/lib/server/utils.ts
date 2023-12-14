import { UsersModel } from '$lib/server/models';
import type { IUser } from '$lib/types';
import type { IStoryFull } from '$lib/types/reading';
import { serialize } from '$lib/utils';

export const loadUsers = async (stories: Array<IStoryFull>) => {
	return await Promise.all(
		[...new Set(stories.map(({ userId }) => userId))].map(async (userId: number) => {
			const author: IUser = await UsersModel.findOne({
				userId: +userId
			})
				.select({
					sessionId: 0,
					_id: 0
				})
				.lean();

			return author ? serialize(author) : null;
		})
	);
};
