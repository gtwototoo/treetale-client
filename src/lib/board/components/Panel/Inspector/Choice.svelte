<script lang="ts">
	import cloneDeep from 'lodash/cloneDeep';
	import filter from 'lodash/filter';
	import findIndex from 'lodash/findIndex';

	import { currentThemeClass } from '$lib/stores/colors.svelte';
	import type { Choice, Frame, LogicModificator, MathModificator, Variable } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import Contenteditable from '$lib/ui/Contenteditable.svelte';
	import FormSplit from '$lib/ui/FormSplit.svelte';
	import { button as buttonPresets } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';
	import { correctVariableReplace } from '$lib/utils/text';
	import { checkLogic, choiceModificators, doMath } from '$lib/utils/variableOperations';

	import { inspectorStore } from '$board/stores/inspector.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';

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
					if (!modificator.variableId) continue;
					const variableId = findIndex(inspectorVariables, { id: modificator.variableId });
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

	const logicModificators = $derived(
		choiceModificators(frame.modificators, choice.choiceId, 'logic') as LogicModificator[]
	);
	const mathModificators = $derived(
		choiceModificators(frame.modificators, choice.choiceId, 'math') as MathModificator[]
	);
	const disabled = $derived(
		!choice.frameId ||
			!checkLogic(inspectorVariables, logicModificators) ||
			(choice.asInput && !inputValue)
	);
	const onlyCorrectLogicModificators = $derived(
		filter(logicModificators, (modificator) => !!(modificator.variableId && modificator.value))
	);
	const onlyCorrectMathModificators = $derived(
		filter(mathModificators, (modificator) => !!(modificator.variableId && modificator.value))
	);

	const yellowTextColor = $derived(
		currentThemeClass(clm('text-yellow-200'), clm('text-yellow-500'))
	);
</script>

{#snippet button()}
	<Button
		class={clm(
			buttonPresets.type.primary,
			buttonPresets.size.base,
			inspectorStore.selectedChoices[frameIndex]?.choice.choiceId === choice.choiceId &&
				yellowTextColor,
			'flex-col items-start justify-center gap-1'
		)}
		{disabled}
		onclick={handleClick}
	>
		{#if onlyCorrectLogicModificators.length}
			<p class="text-xs text-orange-500">
				Условие:
				{onlyCorrectLogicModificators
					.map(({ symbol, value, variableId }) => `[${variableId}] ${symbol} ${value}`)
					.join(' и ')}
			</p>
		{/if}
		<div class="w-full text-left break-words whitespace-normal">
			{@html correctVariableReplace(choice.text, inspectorVariables) || 'Вариант выбора'}
		</div>
		{#if onlyCorrectMathModificators.length}
			<p class="text-xs text-blue-500">
				Изменения:
				{onlyCorrectMathModificators
					.map(
						({ symbol, value, variableId }) =>
							`[${variableId}] ${symbol} ${choice.asInput && value === '{input}' ? inputValue : value}`
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
			class={clm(buttonPresets.size.base, 'flex-1', disabled && 'ring-main-200')}
			placeholder={choice.inputText}
		/>
		{@render button()}
	</FormSplit>
{:else}
	{@render button()}
{/if}
