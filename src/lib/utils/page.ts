import findKey from 'lodash/findKey';

type TPage = 'editing' | 'liked' | 'moderated' | 'profile' | 'reading' | 'viewed' | 'viewing';

export const getPageType = (path: string): TPage => {
	const patterns = {
		editing: /^\/\d+\/edit$/,
		liked: /^\/profile\/liked$/,
		moderated: /^\/profile\/moderated$/,
		profile: /^\/profile$/,
		reading: /^\/\d+$/,
		viewed: /^\/profile\/viewed$/,
		viewing: /^\/\d+\/view$/
	};

	return findKey(patterns, (pattern) => pattern.test(path)) as TPage;
};

export const setBodyFullHeight = () => {
	document.documentElement.classList.add('h-full');
	document.body.classList.add('h-full');
};

export const removeBodyFullHeight = () => {
	document.documentElement.classList.remove('h-full');
	document.body.classList.remove('h-full');
};
