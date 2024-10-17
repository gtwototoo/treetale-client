<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import find from 'lodash/find';
	import { Button } from 'treetale-ui';

	import ReadCard from '$lib/components/ReadCard.svelte';
	import { setEndProgress } from '$lib/requests/results';
	import { variablesStore } from '$lib/stores/variables.svelte';
	import type { Frame } from '$lib/types';
	import { correctVariableReplace } from '$lib/utils/text';

	import { enabledChoice, updateCurrentVarsValues } from '../methods.svelte';

	import Choice from './ReadFrame/Choice.svelte';

	let {
		class: classname,
		frame,
		selectedChoiceId,
		storyId,
		progressId
	}: {
		class?: string;
		frame: Frame;
		selectedChoiceId?: number;
		storyId: number;
		progressId: number;
	} = $props();

	let readCard = $state<HTMLDivElement>();

	const dynamicText = (text: null | string) => {
		if (selectedChoiceId) {
			updateCurrentVarsValues(frame.modificators, selectedChoiceId);
		}

		return correctVariableReplace(text, variablesStore.variables) || 'Пустота...';
	};

	const handleEndStory = async () => {
		try {
			const { message } = await setEndProgress(progressId);

			// Результат будет скорее всего в отдельном разделе бд, там должна быть скорее всего статика данных (% прошедших и т.д., кроме версии)
			await goto(`/results/${message.resultId}`);
		} catch (error) {
			console.error(error);
		}
	};

	let availableChoicesCount = $derived(
		frame.choices.filter((choice) => enabledChoice(frame.modificators, choice)).length
	);

	onMount(() => {
		readCard?.scrollIntoView({ behavior: 'smooth' });
	});
</script>

{#if frame}
	<ReadCard bind:readCard class={classname} src={frame.imageUrl} text={dynamicText(frame.text)}>
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
						{#if enabledChoice(frame.modificators, choice)}
							<Choice {storyId} frameId={frame.frameId} {choice} />
						{/if}
					{/each}
				{:else}
					<Button
						onclick={handleEndStory}
						class="adaptive-font adaptive-padding pointer-events-auto bg-main-70 font-medium text-text hover:bg-main"
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
