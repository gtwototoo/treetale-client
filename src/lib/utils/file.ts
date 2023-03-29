export const sizeNamePattern = (name: string) => {
	const patternSize = name?.match(/.*@(\d*)x(\d*)/)?.map((v) => +v);

	return patternSize ? [patternSize[1], patternSize[2]] : patternSize;
};
