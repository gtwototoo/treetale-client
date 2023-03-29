import { storiesStore } from '$lib/stores/profile';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	storiesStore.set(data.stories);

	return data;
};
