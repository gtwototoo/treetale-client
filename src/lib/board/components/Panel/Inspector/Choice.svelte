<script lang="ts">
	import { inspectorStore } from '$board/stores/inspector.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';
	import cloneDeep from 'lodash/cloneDeep';
	import filter from 'lodash/filter';
	import findIndex from 'lodash/findIndex';
	import { Button } from 'treetale-ui';

	import type { Choice, Frame, LogicModificator, MathModificator, Variable } from '$lib/types';

	import { currentThemeClass } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { correctVariableReplace } from '$lib/utils/text';
	import { checkLogic, choiceModificators, doMath } from '$lib/utils/variableOperations';

	let {
		choice,
		frame,
		frameIndex,
		inspectorVariables = $bindable()
	}: {
		choice: Choice;
		frame: Frame;
		frameIndex: number;
		inspectorVariables: Variable[];
	} = $props();

	const handleClick = () => {
		if (inspectorStore.selectedChoices[frameIndex]?.choice.choiceId === choice.choiceId) {
			return;
		}

		inspectorStore.selectedChoices = inspectorStore.selectedChoices.slice(0, frameIndex);

		inspectorStore.selectedChoices.push({
			choice,
			frameId: frame.frameId
		});

		inspectorVariables = cloneDeep(variablesStore.variables);

		for (const selectedStage of inspectorStore.selectedChoices) {
			const mathModificators = choiceModificators(
				frame,
				selectedStage.choice.choiceId,
				'math'
			) as MathModificator[];

			if (mathModificators.length) {
				for (const modificator of mathModificators) {
					const variableId = findIndex(inspectorVariables, { name: modificator.variable });
					const firstValue = inspectorVariables[variableId].value;

					inspectorVariables[variableId].value = doMath(
						firstValue,
						modificator.symbol,
						modificator.value
					);
				}
			}
		}
	};

	let logicModificators = $derived(
		choiceModificators(frame, choice.choiceId, 'logic') as LogicModificator[]
	);
	let mathModificators = $derived(
		choiceModificators(frame, choice.choiceId, 'math') as MathModificator[]
	);
	let yellowTextColor = $derived(
		currentThemeClass(clm('text-yellow-200'), clm('text-yellow-500'))
	);
	let disabled = $derived(!choice.frameId || !checkLogic(inspectorVariables, logicModificators));
	let onlyCorrectLogicModificators = $derived(
		filter(logicModificators, (modificator) => !!(modificator.variable && modificator.value))
	);
</script>

<Button
	class={clm(
		inspectorStore.selectedChoices[frameIndex]?.choice.choiceId === choice.choiceId &&
			yellowTextColor,
		'flex-col items-start gap-1 bg-contrast-9 hover:bg-contrast-7'
	)}
	{disabled}
	onclick={handleClick}
>
	{#if onlyCorrectLogicModificators.length}
		<p class="text-xs text-orange-500">
			Условие:
			{onlyCorrectLogicModificators
				.map(({ symbol, value, variable }) => `${variable} ${symbol} ${value}`)
				.join(' и ')}
		</p>
	{/if}
	<div class="w-full whitespace-normal break-words text-left">
		{@html correctVariableReplace(choice.text, inspectorVariables) || 'Вариант выбора'}
	</div>
	{#if mathModificators.length}
		<p class="text-xs text-blue-500">
			Изменения:
			{mathModificators
				.map(({ symbol, value, variable }) => `${variable} ${symbol} ${value}`)
				.join(' и ')}
		</p>
	{/if}
</Button>
