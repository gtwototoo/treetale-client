export const findByPattern = <T = Record<string, RegExp>>(
	string: string,
	patterns: T
): keyof T | undefined => {
	const key: Array<keyof T> = Object.entries(patterns).find((data) => data[1].test(string));

	return key && key[0];
};
