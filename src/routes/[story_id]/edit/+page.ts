import Editing from '$lib/components/modules/Header/Editing.svelte';
import { frames as framesStore, storyInfo } from '$lib/stores/editing';

export const load = ({ data }) => {
	const {
		story: { frames, ...info }
	} = data;

	framesStore.init(frames);
	storyInfo.set({
		...info,
		dragImageMode: false,
		addFrameMode: false,
		addFrameOffset: null,
		timer: null,
		saved: true
	});

	return {
		...data,
		header: Editing
	};
};
