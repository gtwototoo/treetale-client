import type { ComparisonOperator, MathOperator, VariableExpects } from '$lib/types';

export const correctToType = (value: number | string, expect: VariableExpects) => {
	return expect === 'Число' ? +value : value;
};

export const doLogic = (
	firstValue: number | string,
	symbol: ComparisonOperator,
	secondValue: number | string
) => {
	const operations: Record<ComparisonOperator, boolean> = {
		'<': firstValue < secondValue,
		'=': firstValue === secondValue,
		'>': firstValue > secondValue,
		'≠': firstValue !== secondValue,
		'≤': firstValue <= secondValue,
		'≥': firstValue >= secondValue
	};

	if (!(symbol in operations)) return false;

	return operations[symbol];
};

export const doMath = (
	firstValue: number | string,
	symbol: MathOperator,
	secondValue: number | string
) => {
	if (symbol === '=') return `${secondValue}`;

	if (typeof firstValue === 'string' || typeof secondValue === 'string') return `${firstValue}`;

	const operations: Record<Exclude<MathOperator, '='>, number> = {
		'*': firstValue * secondValue,
		'+': firstValue + secondValue,
		'/': firstValue / secondValue,
		'-': firstValue - secondValue
	};

	if (!(symbol in operations)) return `${firstValue}`;

	return `${operations[symbol]}`;
};
