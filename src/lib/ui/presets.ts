import { clm } from '$lib/utils/classMerge';

export const button = {
	size: {
		sm: clm('px-2.5 py-1.5 rounded-md'),
		base: clm('px-3 py-2 rounded-lg'),
		lg: clm('px-6 py-3 rounded-xl'),
		xl: clm('px-8 py-4 rounded-2xl')
	},
	type: {
		primary: clm('bg-main-300 hover:bg-main-400 ring-1 ring-main-500 text-text')
	}
};
