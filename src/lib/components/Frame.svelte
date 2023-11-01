<script lang="ts">
	import { FormSplit } from '$UI';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { framesStore, variablesStore } from '$lib/stores/reading';
	import { correctVariableReplace, getFrameFromId } from '$lib/utils';
	import clsx from 'clsx';
	import { createEventDispatcher } from 'svelte';
	import Choice from './Choice.svelte';

	const dispatch = createEventDispatcher<{
		click: { choiceId: number };
	}>();

	let className = '';
	export { className as class };

	export let frameId: number;
	export let selectedChoiceId: number;

	const handleClick = (choiceId: number) => {
		dispatch('click', { choiceId });
	};

	$: ({ imageId, text, choices } = getFrameFromId($framesStore, frameId));
</script>

<ReadCard
	src={imageId}
	text={correctVariableReplace(text, $variablesStore) || 'Пустота...'}
	class={clsx('text-left', className)}
	classCard="justify-between !items-start"
>
	{#if choices.length}
		<FormSplit vertical class="w-full !divide-main-10">
			{#each choices as { choiceId, text } (choiceId)}
				<Choice active={selectedChoiceId === choiceId} on:click={() => handleClick(choiceId)}>
					{correctVariableReplace(text, $variablesStore) || 'Неожиданный поворот'}
				</Choice>
			{/each}
		</FormSplit>
	{/if}
</ReadCard>
