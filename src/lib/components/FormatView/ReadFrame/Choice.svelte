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

<FormSplit vertical class={clm(choice.asInput && 'bg-main-600 ring-main-600 rounded-lg ring-2')}>
	{#if choice.asInput}
		<Contenteditable
			class="adaptive-font adaptive-padding bg-main-200 hover:bg-main-400 pointer-events-auto"
			focusClass="bg-main-400"
			placeholder={choice.inputText || 'Ввод текста'}
		/>
	{/if}
	<Button
		class="adaptive-padding adaptive-font bg-main-700 text-text hover:bg-main pointer-events-auto text-left whitespace-normal"
		onclick={selectChoice}
		loading={loadingFrame && loadingChoice}
		disabled={loadingFrame && !loadingChoice}
	>
		{@html correctVariableReplace(choice.text, variablesStore.variables) || 'Неожиданный поворот'}
	</Button>
</FormSplit>
