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
		frame
	}: {
		frame: Frame;
	} = $props();

	const addChoice = () => {
		const choiceId = frame.choices.length ? last(frame.choices)!.choiceId + 1 : 0;

		frame.choices.push({
			asInput: false,
			choiceId,
			frameId: null,
			text: ''
		});

		changesHistoryStore.add('Добавление выбора', Plus);
	};
</script>

<FormSplit vertical>
	{#each frame.choices as choice (choice.choiceId)}
		<Choice {choice} {frame} />
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
