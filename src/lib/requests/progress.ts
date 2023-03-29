import { fetchPost } from '.';

export const updateProgress = async (storyId: number, choiceId: number) => {
	return await fetchPost(`/api/progress/${storyId}`, choiceId);
};
