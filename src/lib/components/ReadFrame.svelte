<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import clsx from 'clsx';
	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';

	import type { ILogicOperation } from '$lib/types';

	import { FormSplit } from '$UI';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { framesStore, soundStore, variablesStore } from '$lib/stores/reading';
	import { correctToType, correctVariableReplace, doLogic, doMath } from '$lib/utils';

	import Choice from './Choice.svelte';

	const dispatch = createEventDispatcher<{
		click: { choiceId: number };
	}>();

	let className = '';
	export { className as class };

	export let frameId: number;
	export let selectedChoiceId: number | undefined = undefined;
	export let isLastFrame: boolean;

	const handleClick = (choiceId: number) => {
		dispatch('click', { choiceId });
	};

	const updateVars = (frameId: number, choiceId: number) => {
		if (!choiceId) return;

		const frame = find($framesStore, { frameId });
		const choice = find(frame.choices, { choiceId });

		if (!choice.mathOperations.length) return;

		for (const { symbol, value, variable: name } of choice.mathOperations) {
			const variableId = findIndex($variablesStore, { name });
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
			.map(({ symbol, value: secondValue, variable: name }) => {
				const { expect, value: firstValue } = find($variablesStore, { name });

				return doLogic(
					correctToType(firstValue, expect),
					symbol,
					correctToType(secondValue, expect)
				);
			})
			.every((operation) => operation);
	};

	const dynamicText = () => {
		updateVars(frameId, selectedChoiceId);

		return correctVariableReplace(text, $variablesStore) || 'Пустота...';
	};

	$: ({ choices, imageUrl, soundUrl, text } = find($framesStore, { frameId }));

	$: if (isLastFrame) {
		soundStore.setSrc(soundUrl);
	}
</script>

<ReadCard class={clsx('text-left', className)} src={imageUrl} text={dynamicText()}>
	{#if choices.length}
		<FormSplit class="w-full" vertical>
			{#each choices as { choiceId, logicOperations, text } (choiceId)}
				{#if !logicOperations.length || checkLogic(logicOperations)}
					<Choice
						active={selectedChoiceId === choiceId}
						on:click={() => handleClick(choiceId)}
					>
						{@html correctVariableReplace(text, $variablesStore) || 'Неожиданный поворот'}
					</Choice>
				{/if}
			{/each}
		</FormSplit>
	{/if}
</ReadCard>
