<script lang="ts">
	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';

	import type { LogicOperation } from '$lib/types';

	import ReadCard from '$lib/components/ReadCard.svelte';
	import { framesStore, variablesStore } from '$lib/stores/reading';

	import { clm } from '$lib/utils/classMerge';
	import { correctVariableReplace } from '$lib/utils/text';
	import { correctToType, doLogic, doMath } from '$lib/utils/variableOperations';
	import { Button, FormSplit } from 'treetale-ui';
	import Likes from './Likes.svelte';
	import Choice from './ReadFrame/Choice.svelte';

	let {
		class: classname,
		frameId,
		selectedChoiceId,
		likes,
		storyId,
		onclick,
		onresults
	}: {
		class?: string;
		frameId: number;
		selectedChoiceId?: number;
		likes: number[];
		storyId: number;
		onclick?: (choiceId: number) => void;
		onresults?: () => void;
	} = $props();

	const selectChoice = (choiceId: number) => {
		onclick?.(choiceId);
	};

	const updateVars = (frameId: number, choiceId?: number) => {
		if (!choiceId) return;

		const frame = find($framesStore, { frameId });
		const choice = find(frame?.choices, { choiceId });

		if (!choice?.mathOperations.length) return;

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

	const handleGetResults = () => {
		onresults?.();
	};

	const checkLogic = (logicOperations: LogicOperation[]) => {
		return logicOperations
			.map(({ symbol, value: secondValue, variable: name }) => {
				const { expect, value: firstValue } = find($variablesStore, { name })!;

				return doLogic(
					correctToType(firstValue, expect),
					symbol,
					correctToType(secondValue, expect)
				);
			})
			.every((operation) => operation);
	};

	const dynamicText = (text: string) => {
		updateVars(frameId, selectedChoiceId);

		return correctVariableReplace(text, $variablesStore) || 'Пустота...';
	};

	let { choices, imageUrl, text } = $derived(find($framesStore, { frameId })!);
</script>

<ReadCard class={clm('text-left', classname)} src={imageUrl} text={dynamicText(text!)}>
	{#if choices.length}
		<FormSplit class="w-full" vertical>
			{#each choices as { choiceId, logicOperations, text, frameId } (choiceId)}
				{#if frameId && (!logicOperations.length || checkLogic(logicOperations))}
					<Choice onclick={() => selectChoice(choiceId)}>
						{@html correctVariableReplace(text, $variablesStore) || 'Неожиданный поворот'}
					</Choice>
				{/if}
			{/each}
		</FormSplit>
	{:else}
		<div class="flex w-full gap-3">
			<Button
				size="xl"
				class="w-full justify-center bg-main-70 hover:bg-main"
				onclick={handleGetResults}
			>
				Завершить
			</Button>
			<Likes {storyId} {likes} />
		</div>
	{/if}
</ReadCard>
