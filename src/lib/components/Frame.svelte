<script lang="ts">
	import { FormSplit } from '$UI';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import type { IFrame, IVariable } from '$lib/types';
	import { correctVariableReplace } from '$lib/utils';
	import clsx from 'clsx';
	import Choice from './Choice.svelte';

	let className = '';
	export { className as class };

	export let last: boolean;
	export let frame: IFrame;
	export let vars: IVariable[];
	export let selectedChoiceId: number | undefined;
	export let setChoice: (choiceId: number) => void;
</script>

<ReadCard
	src={frame.imageId}
	text={correctVariableReplace(frame.text, vars) || 'Пустота...'}
	class={clsx('text-left', !last && 'pointer-events-none opacity-10', className)}
>
	{#if frame.choices.length}
		<FormSplit vertical class="w-full">
			{#each frame.choices as { choiceId, text } (choiceId)}
				<Choice {choiceId} active={selectedChoiceId === choiceId} {setChoice}>
					{correctVariableReplace(text, vars) || 'Неожиданный поворот'}
				</Choice>
			{/each}
		</FormSplit>
	{/if}
</ReadCard>
