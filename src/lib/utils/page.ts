import { findByPattern } from './find';

type TPage = 'viewed' | 'liked' | 'profile' | 'editing' | 'reading';

export const getPageType = (path: string): TPage => {
	return findByPattern(path, {
		profile: /^\/profile$/,
		liked: /^\/profile\/liked$/,
		viewed: /^\/profile\/viewed$/,
		editing: /^\/\d+\/edit$/,
		reading: /^\/\d+$/
	});
};

export const setBodyFullHeight = () => {
	document.documentElement.classList.add('h-full');
	document.body.classList.add('h-full');
};

export const removeBodyFullHeight = () => {
	document.documentElement.classList.remove('h-full');
	document.body.classList.remove('h-full');
};
