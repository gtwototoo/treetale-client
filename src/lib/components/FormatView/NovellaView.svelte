<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { Image } from 'treetale-ui';

	import type { Frame } from '$lib/types';

	import { variablesStore } from '$lib/stores/variables.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { correctVariableReplace, correctWhitespace } from '$lib/utils/text';

	import Choice from '../ReadFrame/Choice.svelte';
	import { enabledChoice, setChoice } from '../methods.svelte';

	let {
		lastFrame,
		storyId
	}: {
		lastFrame: Frame;
		storyId: number;
	} = $props();

	let loadingId = $state<null | number>(null);

	const selectChoice = async (choiceId: number) => {
		if (!$page.data.session) {
			goto('/signin');
		}

		await setChoice(storyId, lastFrame.frameId, choiceId);
		await invalidateAll();
	};

	let availableChoicesCount = $derived(
		lastFrame.choices.filter((choice) => enabledChoice(lastFrame.modificators, choice)).length
	);
</script>

<div class="size-full">
	{#if lastFrame.imageUrl}
		<Image alt="Иллюстрация" class="size-full text-text" cover src={lastFrame.imageUrl} />
	{/if}
	<div class="absolute bottom-0 flex w-full justify-center p-6">
		<div
			class="flex max-h-52 w-full max-w-7xl flex-col gap-4 overflow-auto rounded-xl bg-contrast p-4 text-text"
		>
			<div
				class={clm(
					'adaptive-padding',
					lastFrame.text && lastFrame.text.length > 50
						? 'adaptive-font'
						: 'adaptive-font-upper'
				)}
			>
				{@html correctWhitespace(lastFrame.text!) || 'Пустота...'}
			</div>
			<div class="flex flex-col items-start gap-2">
				{#if availableChoicesCount}
					{#each lastFrame.choices as choice (choice.choiceId)}
						{#if enabledChoice(lastFrame.modificators, choice)}
							<Choice
								onclick={() => selectChoice(choice.choiceId)}
								loading={loadingId === choice.choiceId}
								disabled={loadingId !== null && loadingId !== choice.choiceId}
							>
								{@html correctVariableReplace(choice.text, variablesStore.variables) ||
									'Неожиданный поворот'}
							</Choice>
						{/if}
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
