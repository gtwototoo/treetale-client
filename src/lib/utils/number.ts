export const collapseValue = (value: number): string => {
	if (value < 1000) return String(value);

	const collapseSymbols = ['K', 'M', 'B', 'T'];
	const index = Math.floor(Math.log(value) / Math.log(1000));
	const symbol = collapseSymbols[index - 1] || 'HI';

	return `${Math.floor(100 * (value / 10 ** (3 * index))) / 100}${symbol}`;
};
