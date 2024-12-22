<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';

	import { Button, Contenteditable, FormSplit } from 'treetale-ui';

	import { setChoice } from '$lib/components/methods.svelte';
	import { loadingStore } from '$lib/stores/reading.svelte';
	import { variablesStore } from '$lib/stores/variables.svelte';
	import type { Choice } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';
	import { correctVariableReplace } from '$lib/utils/text';

	const {
		choice,
		frameId,
		storyId
	}: {
		choice: Choice;
		frameId: number;
		storyId: number;
	} = $props();

	const selectChoice = async () => {
		if (!page.data.session) {
			await goto('/signin');
		}

		await setChoice(storyId, frameId, choice.choiceId);
		await invalidateAll();
	};

	let loadingFrame = $derived(loadingStore.frameId === frameId);
	let loadingChoice = $derived(loadingStore.choiceId === choice.choiceId);
</script>

<FormSplit vertical class={clm(choice.asInput && 'rounded-lg bg-main-60 ring-2 ring-main-60')}>
	{#if choice.asInput}
		<Contenteditable
			class="adaptive-font adaptive-padding pointer-events-auto bg-main-20 hover:bg-main-40"
			focusClass="bg-main-40"
			placeholder={choice.inputText || 'Ввод текста'}
		/>
	{/if}
	<Button
		class="adaptive-padding adaptive-font pointer-events-auto whitespace-normal bg-main-70 text-left text-text hover:bg-main"
		onclick={selectChoice}
		loading={loadingFrame && loadingChoice}
		disabled={loadingFrame && !loadingChoice}
	>
		{@html correctVariableReplace(choice.text, variablesStore.variables) || 'Неожиданный поворот'}
	</Button>
</FormSplit>
