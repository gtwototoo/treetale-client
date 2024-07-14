import findKey from 'lodash/findKey';

type TPage = 'liked' | 'moderated' | 'profile' | 'reading' | 'viewed' | 'viewing';

export const getPageType = (path: string): TPage => {
	const patterns = {
		profile: /^\/profile$/,
		reading: /^\/\d+$/
	};

	return findKey(patterns, (pattern) => pattern.test(path)) as TPage;
};
