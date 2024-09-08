import find from 'lodash/find';
import findIndex from 'lodash/findIndex';

import type { Choice, LogicModificator, MathModificator, Modificator } from '$lib/types/index';

import { updateProgress } from '$lib/requests/progress';
import { framesStore } from '$lib/stores/reading.svelte';
import { soundStore } from '$lib/stores/sound.svelte';
import { variablesStore } from '$lib/stores/variables.svelte';
import {
	checkLogic,
	choiceModificators,
	correctToType,
	doMath
} from '$lib/utils/variableOperations';

export const enabledChoice = (modificators: Modificator[], choice: Choice) => {
	const logicModificators = choiceModificators(
		modificators,
		choice.choiceId,
		'logic'
	) as LogicModificator[];

	return (
		choice.frameId &&
		(!logicModificators.length || checkLogic(variablesStore.variables, logicModificators))
	);
};

export const updateCurrentVarsValues = (modificators: Modificator[], choiceId: number) => {
	const mathModificators = choiceModificators(modificators, choiceId, 'math') as MathModificator[];

	if (!mathModificators.length) return;

	for (const { symbol, value, variable: name } of mathModificators) {
		const variableId = findIndex(variablesStore.variables, { name });
		const { expect } = variablesStore.variables[variableId];
		const firstValue = variablesStore.variables[variableId].value;

		variablesStore.variables[variableId].value = doMath(
			correctToType(firstValue, expect),
			symbol,
			correctToType(value, expect)
		);
	}
};

export const setChoice = async (storyId: number, frameId: number, choiceId: number) => {
	try {
		await updateProgress(storyId, choiceId);

		const frame = find(framesStore.frames, { frameId });

		if (!frame) return;

		updateCurrentVarsValues(frame.modificators, choiceId);

		soundStore.sound?.play();
	} catch (error) {
		console.error(error);
	}
};
