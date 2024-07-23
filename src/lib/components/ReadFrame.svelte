<script lang="ts">
	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';
	import { Button, FormSplit } from 'treetale-ui';

	import type { LogicOperation } from '$lib/types';

	import ReadCard from '$lib/components/ReadCard.svelte';
	import { framesStore } from '$lib/stores/reading.svelte';
	import { variablesStore } from '$lib/stores/variables.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { correctVariableReplace } from '$lib/utils/text';
	import { correctToType, doLogic, doMath } from '$lib/utils/variableOperations';

	import Likes from './Likes.svelte';
	import Choice from './ReadFrame/Choice.svelte';

	let {
		class: classname,
		frameId,
		likes,
		onclick,
		onresults,
		selectedChoiceId,
		storyId
	}: {
		class?: string;
		frameId: number;
		likes: number[];
		onclick?: (choiceId: number) => void;
		onresults?: () => void;
		selectedChoiceId?: number;
		storyId: number;
	} = $props();

	const selectChoice = (choiceId: number) => {
		onclick?.(choiceId);
	};

	const updateVars = (frameId: number, choiceId?: number) => {
		if (!choiceId) return;

		const frame = find(framesStore.frames, { frameId });
		const choice = find(frame?.choices, { choiceId });

		if (!choice?.mathOperations.length) return;

		for (const { symbol, value, variable: name } of choice.mathOperations) {
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

	const checkLogic = (logicOperations: LogicOperation[]) => {
		return logicOperations
			.map(({ symbol, value: secondValue, variable: name }) => {
				const { expect, value: firstValue } = find(variablesStore.variables, { name })!;

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

		return correctVariableReplace(text, variablesStore.variables) || 'Пустота...';
	};

	let { choices, imageUrl, text } = $derived(find(framesStore.frames, { frameId })!);
</script>

<ReadCard class={clm('relative text-left', classname)} src={imageUrl} text={dynamicText(text!)}>
	{#if choices.length}
		<FormSplit class="w-full" vertical>
			{#each choices as { choiceId, frameId, logicOperations, text } (choiceId)}
				{#if frameId && (!logicOperations.length || checkLogic(logicOperations))}
					<Choice onclick={() => selectChoice(choiceId)}>
						{@html correctVariableReplace(text, variablesStore.variables) ||
							'Неожиданный поворот'}
					</Choice>
				{/if}
			{/each}
		</FormSplit>
		<div class="absolute top-full mt-5 flex items-center gap-2">
			<div class="min-w-[1.75rem] rounded-lg bg-main-70 px-2 py-1 font-bold">ПРОБЕЛ</div>
			<p>- Далее</p>
		</div>
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
