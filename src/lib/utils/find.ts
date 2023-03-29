export const findByPattern = (
	string: string,
	patterns: Record<string, RegExp>
): string | undefined => {
	const key = Object.entries(patterns).find((data) => data[1].test(string));

	return key && key[0];
};
