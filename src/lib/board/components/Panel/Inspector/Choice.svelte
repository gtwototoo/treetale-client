<script lang="ts">
	import { inspectorStore } from '$board/stores/inspector.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';
	import cloneDeep from 'lodash/cloneDeep';
	import filter from 'lodash/filter';
	import findIndex from 'lodash/findIndex';
	import { Button, Contenteditable, FormSplit } from 'treetale-ui';

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

	let inputValue = $state('');

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
				frame.modificators,
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
						choice.asInput ? inputValue : modificator.value
					);
				}
			}
		}
	};

	let logicModificators = $derived(
		choiceModificators(frame.modificators, choice.choiceId, 'logic') as LogicModificator[]
	);
	let mathModificators = $derived(
		choiceModificators(frame.modificators, choice.choiceId, 'math') as MathModificator[]
	);
	let disabled = $derived(
		!choice.frameId ||
			!checkLogic(inspectorVariables, logicModificators) ||
			(choice.asInput && !inputValue)
	);
	let onlyCorrectLogicModificators = $derived(
		filter(logicModificators, (modificator) => !!(modificator.variable && modificator.value))
	);

	let yellowTextColor = $derived(
		currentThemeClass(clm('text-yellow-200'), clm('text-yellow-500'))
	);
</script>

{#snippet button()}
	<Button
		class={clm(
			inspectorStore.selectedChoices[frameIndex]?.choice.choiceId === choice.choiceId &&
				yellowTextColor,
			'flex-col items-start justify-center gap-1 bg-contrast-9 hover:bg-contrast-7'
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
					.map(
						({ symbol, value, variable }) =>
							`${variable} ${symbol} ${choice.asInput && value === '{input}' ? inputValue : value}`
					)
					.join(' и ')}
			</p>
		{/if}
	</Button>
{/snippet}

{#if choice.asInput}
	<FormSplit vertical>
		<Contenteditable
			bind:html={inputValue}
			class="flex-1 bg-contrast-7 hover:bg-contrast-5"
			placeholder={choice.inputText}
		/>
		{@render button()}
	</FormSplit>
{:else}
	{@render button()}
{/if}
