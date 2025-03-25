<script lang="ts">
	import { Button } from 'treetale-ui';

	import type { Frame } from '$lib/types';
	import FormSplit from '$lib/ui/FormSplit.svelte';
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

<FormSplit vertical>
	{#each frame.choices as choice (choice.choiceId)}
		<Choice {choice} {frame} {isDragging} {isSelected} {isSelectedBindingChoice} />
	{/each}
	<Button
		class="bg-contrast-500 text-text"
		disabled={(isBindingMode() && !!connectionStartStore.frameId) || readonlyModeStore.isEnabled}
		onclick={() => addChoice(frame)}
		onmousedown={stopPropagation}
	>
		Добавить вариант
	</Button>
</FormSplit>
