import type { Variable } from '$lib/types';

const getVariables = () => {
	let variables = $state<Variable[]>([]);

	return {
		get variables() {
			return variables;
		},
		set variables(value) {
			variables = value;
		}
	};
};

export const variablesStore = getVariables();
