import type { TComparisonOperator, TMathOperator, TVariableExpects } from '$lib/types';

export const correctToType = (value: string | number, expect: TVariableExpects) => {
	return expect === 'Число' ? +value : value;
};

export const doLogic = (
	firstValue: string | number,
	symbol: TComparisonOperator,
	secondValue: string | number
) => {
	const operations: Record<TComparisonOperator, boolean> = {
		'=': firstValue === secondValue,
		'≥': firstValue >= secondValue,
		'≤': firstValue <= secondValue,
		'≠': firstValue !== secondValue,
		'<': firstValue < secondValue,
		'>': firstValue > secondValue
	};

	if (!(symbol in operations)) return false;

	return operations[symbol];
};

export const doMath = (
	firstValue: number | string,
	symbol: TMathOperator,
	secondValue: number | string
) => {
	if (symbol === '=') return `${secondValue}`;

	if (typeof firstValue === 'string' || typeof secondValue === 'string') return `${firstValue}`;

	const operations: Record<Exclude<TMathOperator, '='>, number> = {
		'+': firstValue + secondValue,
		'-': firstValue - secondValue,
		'/': firstValue / secondValue,
		'*': firstValue * secondValue
	};

	if (!(symbol in operations)) return `${firstValue}`;

	return `${operations[symbol]}`;
};
