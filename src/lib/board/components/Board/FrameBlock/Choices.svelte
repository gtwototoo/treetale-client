<script lang="ts">
	import type { Frame } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import FormSplit from '$lib/ui/FormSplit.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';
	import { stopPropagation } from '$lib/utils/eventsModificators';

	import { addChoice } from '$board/components/methods.svelte';
	import { connectionStartStore } from '$board/stores/frames.svelte';
	import { isBindingMode, readonlyModeStore } from '$board/stores/index.svelte';

	import Choice from './Choice.svelte';

	const {
		frame,
		isDragging,
		isSelected,
		isSelectedBindingChoice
	}: {
		frame: Frame;
		isDragging: boolean;
		isSelected: boolean;
		isSelectedBindingChoice: boolean;
	} = $props();
</script>

{#if frame.choices.length}
	<FormSplit vertical>
		{#each frame.choices as choice (choice.choiceId)}
			<Choice {choice} {frame} {isDragging} {isSelected} {isSelectedBindingChoice} />
		{/each}
	</FormSplit>
{:else}
	<Button
		class={clm(button.size.base, button.type.primary, 'py-3')}
		disabled={(isBindingMode() && !!connectionStartStore.frameId) || readonlyModeStore.isEnabled}
		onclick={() => addChoice(frame)}
		onmousedown={stopPropagation}
	>
		Добавить вариант
	</Button>
{/if}
