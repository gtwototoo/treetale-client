<script lang="ts">
	import { onMount } from 'svelte';

	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';
	import { Button, Contenteditable } from 'treetale-ui';

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
		loadingId,
		onclick,
		onresults,
		selectedChoiceId
	}: {
		class?: string;
		frame: Frame;
		loadingId: null | number;
		onclick?: (choiceId: number) => void;
		onresults?: () => void;
		selectedChoiceId?: number;
	} = $props();

	let readCard = $state<HTMLDivElement>();

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

	onMount(() => {
		readCard?.scrollIntoView({ behavior: 'smooth' });
	});
</script>

{#if frame}
	<ReadCard
		bind:readCard
		class={clm(classname)}
		src={frame.imageUrl}
		text={dynamicText(frame.text)}
	>
		{#if selectedChoiceId !== undefined}
			{@const choice = find(frame.choices, { choiceId: selectedChoiceId })!}
			<div class="adaptive-font adaptive-padding rounded-lg bg-main-30 text-left text-text">
				{@html correctVariableReplace(choice.text, variablesStore.variables) ||
					'Неожиданный поворот'}
			</div>
		{:else}
			<div class="flex flex-col items-start gap-2">
				{#if availableChoicesCount}
					{#each frame.choices as choice (choice.choiceId)}
						{#if enabledChoice(choice)}
							{#if choice.asInput}
								<Contenteditable
									placeholder={correctVariableReplace(
										choice.text,
										variablesStore.variables
									)}
								/>
							{:else}
								<Choice
									onclick={() => selectChoice(choice.choiceId)}
									loading={loadingId === choice.choiceId}
									disabled={loadingId !== null && loadingId !== choice.choiceId}
								>
									{@html correctVariableReplace(choice.text, variablesStore.variables) ||
										'Неожиданный поворот'}
								</Choice>
							{/if}
						{/if}
					{/each}
				{:else}
					<Button
						class="adaptive-font adaptive-padding bg-main-70 font-medium text-text hover:bg-main"
						onclick={handleGetResults}
					>
						Завершить историю
					</Button>
				{/if}
			</div>
		{/if}
		{#if availableChoicesCount === 1 && selectedChoiceId === undefined}
			<div class="flex items-center gap-1 text-text opacity-50">
				<div class="min-w-[1.75rem] rounded-lg bg-main-70 px-2 py-1 font-bold">ПРОБЕЛ</div>
				<p>- Далее</p>
			</div>
		{/if}
	</ReadCard>
{/if}
