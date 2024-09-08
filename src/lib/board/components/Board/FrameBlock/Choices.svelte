<script lang="ts">
	import { addChoice } from '$board/components/methods.svelte';
	import { connectionStartStore } from '$board/stores/frames.svelte';
	import { isBinding, readonlyModeStore } from '$board/stores/index.svelte';
	import { Button, FormSplit } from 'treetale-ui';

	import type { Frame } from '$lib/types';

	import { stopPropagation } from '$lib/utils/eventsModificators';

	import Choice from './Choice.svelte';

	let {
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
		class="bg-contrast-5 text-text"
		disabled={(isBinding() && !!connectionStartStore.frameId) || readonlyModeStore.isEnabled}
		onclick={() => addChoice(frame)}
		onmousedown={stopPropagation}
	>
		Добавить вариант
	</Button>
</FormSplit>
