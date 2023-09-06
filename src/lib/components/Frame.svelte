<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import type { IFrame, IVariable } from '$lib/types';
	import { correctVariableReplace } from '$lib/utils';
	import { Button, FormSplit } from '$UI';
	import clsx from 'clsx';

	export let last: boolean;
	export let frame: IFrame;
	let className = '';
	export { className as class };
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
</script>

<ReadCard
	src={frame.imageId}
	text={correctVariableReplace(frame.text, vars) || 'Пустота...'}
	class={clsx(
		{
			'pointer-events-none opacity-10': !last
		},
		className
	)}
>
	{#if frame.choices.length}
		<FormSplit vertical>
			{#each frame.choices as choice (choice.choiceId)}
				{@const active = selectedChoiceId === choice.choiceId}
				{#if choice.frameId}
					<Button
						on:click={() => handleClick(choice.choiceId)}
						variant={active ? 'main' : 'secondary'}
						class={clsx('!whitespace-normal text-left !text-sm sm:!text-base lg:!text-lg', {
							'bg-main !text-text': active
						})}
					>
						{correctVariableReplace(choice.text, vars) || 'Неожиданный поворот'}
					</Button>
				{/if}
			{/each}
		</FormSplit>
	{/if}
</ReadCard>
