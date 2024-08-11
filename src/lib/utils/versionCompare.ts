export const versionCompare = (a: string, b: string) => {
	if (a === b) return 'current';

	const aVersion = a.split('.');
	const bVersion = b.split('.');

	if (aVersion[0] === bVersion[0]) return 'minor';

	return 'breaking';
};
