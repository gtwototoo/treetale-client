import { DEFAULT_COLOR } from '$lib/constants';
import { frames as framesStore, storyInfo } from '$lib/stores/editing';
import { mainColor } from '$lib/stores/story';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const {
		story: { frames, ...info }
	} = data;

	framesStore.init(frames);
	storyInfo.set({
		...info,
		grabbing: false,
		dragImageMode: false,
		addFrameMode: false,
		addFrameOffset: null,
		timer: null,
		saved: true
	});
	mainColor.set(info.color.length ? info.color : DEFAULT_COLOR);
};
