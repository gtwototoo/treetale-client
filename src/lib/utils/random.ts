export const randomInteger = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomArray = <T>(array: T[]): T => {
	return array[randomInteger(0, array.length - 1)];
};
