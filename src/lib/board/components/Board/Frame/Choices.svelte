<script lang="ts">
	import { connectionStartStore } from '$board/stores/frames.svelte';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import { boardStateStore, readonlyModeStore } from '$board/stores/index.svelte';
	import last from 'lodash/last';
	import { Plus } from 'svelte-heros-v2';
	import { Button, FormSplit } from 'treetale-ui';

	import type { Frame } from '$lib/types';

	import { stopPropagation } from '$lib/utils/eventsModificators';

	import Choice from './Choice.svelte';

	let {
		frame,
		isDragging,
		isSelected
	}: {
		frame: Frame;
		isDragging: boolean;
		isSelected: boolean;
	} = $props();

	const addChoice = () => {
		const lastChoiceId = last(frame.choices)?.choiceId || 0;

		frame.choices.push({
			asInput: false,
			choiceId: lastChoiceId + 1,
			frameId: null,
			text: ''
		});

		changesHistoryStore.add('Добавление выбора', Plus);
	};
</script>

<FormSplit vertical>
	{#each frame.choices as choice (choice.choiceId)}
		<Choice {choice} {frame} {isDragging} {isSelected} />
	{/each}
	<Button
		class="bg-contrast-5 text-text"
		disabled={(boardStateStore.mode === 'binding' && !!connectionStartStore.frameId) ||
			readonlyModeStore.isEnabled}
		onclick={addChoice}
		onmousedown={stopPropagation}
	>
		Добавить вариант
	</Button>
</FormSplit>
