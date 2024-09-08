import filter from 'lodash/filter';
import find from 'lodash/find';

import type {
	ComparisonOperators,
	LogicModificator,
	MathOperators,
	Modificator,
	Variable,
	VariableExpects
} from '$lib/types';

export const correctToType = (value: number | string, expect: VariableExpects) => {
	return expect === 'Число' ? +value : value;
};

export const doLogic = (
	firstValue: number | string,
	symbol: ComparisonOperators,
	secondValue: number | string
) => {
	const operations: Record<ComparisonOperators, boolean> = {
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
	symbol: MathOperators,
	secondValue: number | string
) => {
	if (symbol === '=') return `${secondValue}`;

	if (typeof firstValue === 'string' || typeof secondValue === 'string') return `${firstValue}`;

	const operations: Record<Exclude<MathOperators, '='>, number> = {
		'*': firstValue * secondValue,
		'+': firstValue + secondValue,
		'/': firstValue / secondValue,
		'-': firstValue - secondValue
	};

	if (!(symbol in operations)) return `${firstValue}`;

	return `${operations[symbol]}`;
};

export const choiceModificators = (
	modificators: Modificator[],
	choiceId: number,
	type: 'logic' | 'math'
) => {
	return filter(modificators, { choiceId, type });
};

export const checkLogic = (variables: Variable[], logicModificators: LogicModificator[]) => {
	return logicModificators
		.map(({ symbol, value: secondValue, variable: name }) => {
			if (!name) return true;

			const variable = find(variables, { name })!;

			if (!variable) return true;

			const { expect, value: firstValue } = variable;

			return doLogic(
				correctToType(firstValue, expect),
				symbol,
				correctToType(secondValue, expect)
			);
		})
		.every((isVisible) => isVisible);
};
