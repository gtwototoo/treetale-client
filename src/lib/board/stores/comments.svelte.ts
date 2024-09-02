import type { Comment } from '$lib/types';

const getBoardComments = () => {
	let comments = $state<Comment[]>([]);

	return {
		get comments() {
			return comments;
		},
		set comments(updatedComments: Comment[]) {
			comments = [...updatedComments];
		}
	};
};

export const boardCommentsStore = getBoardComments();
