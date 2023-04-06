<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import type { IFrame, IVariable } from '$lib/types';
	import { correctWhitespace, variableReplace } from '$lib/utils';
	import { Button, FormSplit } from '$UI';
	import clsx from 'clsx';

	export let last: boolean;
	export let frame: IFrame;
	let styles = '';
	export { styles as class };
	export let vars: IVariable[];
	export let selectedChoiceId: number | undefined;
	export let setChoice: (choiceId: number) => void;

	const handleClick = (choiceId: number) => {
		if ($page.data.session) {
			setChoice(choiceId);
		} else {
			goto('/signin');
		}
	};

	const text = frame.text ? correctWhitespace(variableReplace(frame.text, vars)) : '';
</script>

<ReadCard
	src={frame.imageId}
	text={text || 'Пустота...'}
	class={clsx(
		{
			'pointer-events-none opacity-10': !last
		},
		styles
	)}
>
	{#if frame.choices.length}
		<FormSplit vertical>
			{#each frame.choices as choice (choice.choiceId)}
				{@const active = selectedChoiceId === choice.choiceId}
				{@const choiceText = correctWhitespace(variableReplace(choice.text, vars))}
				{#if choice.frameId}
					<Button
						on:click={() => handleClick(choice.choiceId)}
						variant={active ? 'main' : 'secondary'}
						class={clsx('choice', {
							'bg-main !text-text': active
						})}
					>
						{choiceText}
					</Button>
				{/if}
			{/each}
		</FormSplit>
	{/if}
</ReadCard>

<style lang="postcss">
	:global(.choice) {
		@apply w-full justify-start overflow-hidden text-ellipsis !whitespace-normal text-left !text-sm sm:!text-base lg:!text-lg;
	}
</style>
