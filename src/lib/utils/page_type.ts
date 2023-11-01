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
