<script lang="ts">
	import findIndex from 'lodash/findIndex';
	import { Button, FormSplit } from 'treetale-ui';

	import type { Choice as ChoiceType, Frame, LogicModificator, MathModificator } from '$lib/types';

	import ReadCard from '$lib/components/ReadCard.svelte';
	import { variablesStore } from '$lib/stores/variables.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { correctVariableReplace } from '$lib/utils/text';
	import {
		checkLogic,
		choiceModificators,
		correctToType,
		doMath
	} from '$lib/utils/variableOperations';

	import Choice from './ReadFrame/Choice.svelte';

	let {
		class: classname,
		frame,
		onclick,
		onresults,
		selectedChoiceId
	}: {
		class?: string;
		frame: Frame;
		onclick?: (choiceId: number) => void;
		onresults?: () => void;
		selectedChoiceId?: number;
	} = $props();

	const selectChoice = (choiceId: number) => {
		onclick?.(choiceId);
	};

	const updateVars = (choiceId?: number) => {
		if (!choiceId) return;

		const mathModificators = choiceModificators(frame, choiceId, 'math') as MathModificator[];

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

	const handleGetResults = () => {
		onresults?.();
	};

	const dynamicText = (text: null | string) => {
		updateVars(selectedChoiceId);

		return correctVariableReplace(text, variablesStore.variables) || 'Пустота...';
	};

	const enabledChoice = (choice: ChoiceType) => {
		const logicModificators = choiceModificators(
			frame,
			choice.choiceId,
			'logic'
		) as LogicModificator[];

		return (
			choice.frameId &&
			(!logicModificators.length || checkLogic(variablesStore.variables, logicModificators))
		);
	};

	let availableChoicesCount = $derived(frame.choices.filter(enabledChoice).length);
</script>

{#if frame}
	<ReadCard
		class={clm('relative text-left', classname)}
		src={frame.imageUrl}
		text={dynamicText(frame.text)}
	>
		{#if availableChoicesCount}
			<FormSplit class="w-full" vertical>
				{#each frame.choices as choice (choice.choiceId)}
					{#if enabledChoice(choice)}
						<Choice onclick={() => selectChoice(choice.choiceId)}>
							{@html correctVariableReplace(choice.text, variablesStore.variables) ||
								'Неожиданный поворот'}
						</Choice>
					{/if}
				{/each}
			</FormSplit>
			{#if availableChoicesCount === 1}
				<div class="absolute top-full mt-5 flex items-center gap-1 opacity-50">
					<div class="min-w-[1.75rem] rounded-lg bg-main-70 px-2 py-1 font-bold">ПРОБЕЛ</div>
					<p>- Далее</p>
				</div>
			{/if}
		{:else}
			<div class="h-px w-full bg-main-50"></div>
			<Button
				size="xl"
				class="w-full justify-center bg-main-70 hover:bg-main"
				onclick={handleGetResults}
			>
				Завершить историю
			</Button>
		{/if}
	</ReadCard>
{/if}
