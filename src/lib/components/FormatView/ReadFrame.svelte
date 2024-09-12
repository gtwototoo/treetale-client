<script lang="ts">
	import { onMount } from 'svelte';

	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import find from 'lodash/find';
	import { Button, Contenteditable, FormSplit } from 'treetale-ui';

	import type { Frame } from '$lib/types';

	import ReadCard from '$lib/components/ReadCard.svelte';
	import { variablesStore } from '$lib/stores/variables.svelte';
	import { correctVariableReplace } from '$lib/utils/text';

	import { enabledChoice, setChoice, updateCurrentVarsValues } from '../methods.svelte';
	import Choice from './ReadFrame/Choice.svelte';

	let {
		class: classname,
		frame,
		selectedChoiceId,
		storyId,
		storyState = $bindable()
	}: {
		class?: string;
		frame: Frame;
		selectedChoiceId?: number;
		storyId: number;
		storyState: 'begin' | 'ended' | 'started';
	} = $props();

	let readCard = $state<HTMLDivElement>();
	let loadingId = $state<null | number>(null);

	const selectChoice = async (choiceId: number) => {
		if (!$page.data.session) {
			goto('/signin');
		}

		await setChoice(storyId, frame.frameId, choiceId);
		await invalidateAll();
	};

	const dynamicText = (text: null | string) => {
		if (selectedChoiceId) {
			updateCurrentVarsValues(frame.modificators, selectedChoiceId);
		}

		return correctVariableReplace(text, variablesStore.variables) || 'Пустота...';
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
							<FormSplit vertical class="rounded-lg bg-main-60 ring-2 ring-main-60">
								{#if choice.asInput}
									<Contenteditable
										class="adaptive-font adaptive-padding bg-main-20 hover:bg-main-40"
										focusClass="bg-main-40"
										placeholder={choice.inputText || 'Ввод текста'}
									/>
								{/if}
								<Choice
									onclick={() => selectChoice(choice.choiceId)}
									loading={loadingId === choice.choiceId}
									disabled={loadingId !== null && loadingId !== choice.choiceId}
								>
									{@html correctVariableReplace(choice.text, variablesStore.variables) ||
										'Неожиданный поворот'}
								</Choice>
							</FormSplit>
						{/if}
					{/each}
				{:else}
					<Button
						class="adaptive-font adaptive-padding pointer-events-auto bg-main-70 font-medium text-text hover:bg-main"
						onclick={() => (storyState = 'ended')}
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
