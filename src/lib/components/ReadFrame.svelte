<script lang="ts">
	import clsx from 'clsx';
	import { createEventDispatcher } from 'svelte';

	import Choice from './Choice.svelte';

	import { FormSplit } from '$UI';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { framesStore, variablesStore } from '$lib/stores/reading';
	import type { ILogicOperation } from '$lib/types';
	import { correctVariableReplace, getChoiceFromId, getFrameFromId } from '$lib/utils';
	import { correctToType, doLogic, doMath } from '$lib/utils/variable_operations';

	const dispatch = createEventDispatcher<{
		click: { choiceId: number };
	}>();

	let className = '';
	export { className as class };

	export let frameId: number;
	export let selectedChoiceId: number | undefined = undefined;

	const handleClick = (choiceId: number) => {
		dispatch('click', { choiceId });
	};

	const updateVars = (frameId: number, choiceId: number) => {
		if (!choiceId) return;

		const frame = getFrameFromId($framesStore, frameId);
		const choice = getChoiceFromId(frame, choiceId);

		if (!choice.mathOperations.length) return;

		for (const { symbol, variable, value } of choice.mathOperations) {
			const variableId = $variablesStore.findIndex(({ name }) => name === variable);
			const { expect } = $variablesStore[variableId];
			const firstValue = $variablesStore[variableId].value;

			$variablesStore[variableId].value = doMath(
				correctToType(firstValue, expect),
				symbol,
				correctToType(value, expect)
			);
		}
	};

	const checkLogic = (logicOperations: Array<ILogicOperation>) => {
		return logicOperations
			.map(({ variable, symbol, value: firstValue }) => {
				const { value, expect } = $variablesStore.find(({ name }) => name === variable);

				return doLogic(correctToType(value, expect), symbol, correctToType(firstValue, expect));
			})
			.every((operation) => operation);
	};

	const dynamicText = () => {
		updateVars(frameId, selectedChoiceId);

		return correctVariableReplace(text, $variablesStore) || 'Пустота...';
	};

	$: ({ imageUrl, text, choices } = getFrameFromId($framesStore, frameId));
</script>

<ReadCard
	src={imageUrl}
	text={dynamicText()}
	class={clsx('text-left', className)}
	classCard="justify-between !items-start"
>
	{#if choices.length}
		<FormSplit vertical class="w-full divide-main-10">
			{#each choices as { choiceId, text, logicOperations } (choiceId)}
				{#if !logicOperations.length || checkLogic(logicOperations)}
					<Choice
						active={selectedChoiceId === choiceId}
						on:click={() => handleClick(choiceId)}
					>
						{correctVariableReplace(text, $variablesStore) || 'Неожиданный поворот'}
					</Choice>
				{/if}
			{/each}
		</FormSplit>
	{/if}
</ReadCard>
