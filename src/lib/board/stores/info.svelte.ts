import type { Story } from '$lib/types';

const getStoryInfo = () => {
	let info = $state<Story>();

	return {
		get info() {
			return info;
		},
		set info(value) {
			info = value;
		}
	};
};

export const storyInfoStore = getStoryInfo();
