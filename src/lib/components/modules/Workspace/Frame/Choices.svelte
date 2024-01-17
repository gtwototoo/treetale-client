<script lang="ts">
	import clsx from 'clsx';
	import { Plus } from 'svelte-heros-v2';

	import { Button, FormSplit } from '$UI';
	import { readonlyStore } from '$lib/stores/editing';
	import { changesHistory } from '$lib/stores/history';
	import { activeModeStore, connectionStore, framesDataStore } from '$lib/stores/workspace';
	import { last } from '$lib/utils';
	import Choice from './Choice.svelte';

	export let frameKey: number;

	$: ({ choices } = $framesDataStore[frameKey]);

	const addChoice = () => {
		const choiceId = choices.length ? last(choices).choiceId + 1 : 0;

		$framesDataStore[frameKey].choices = [
			...choices,
			{
				text: null,
				frameId: null,
				choiceId,
				mathOperations: [],
				logicOperations: []
			}
		];
		changesHistory.add('Добавление выбора', Plus);
	};
</script>

<FormSplit vertical>
	{#each choices as choice (choice.choiceId)}
		<Choice {...choice} {frameKey} />
	{/each}
	<Button
		disabled={($activeModeStore === 'binding' && !!$connectionStore) || $readonlyStore}
		variant="main"
		class={clsx('!text-text', $activeModeStore === 'binding' ? 'bg-main-60' : 'bg-main-40')}
		on:click={addChoice}
		on:mousedown={(e) => e.stopPropagation()}
	>
		Добавить вариант
	</Button>
</FormSplit>
