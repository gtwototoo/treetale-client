<script lang="ts">
	import clsx from 'clsx';
	import last from 'lodash/last';
	import { Plus } from 'svelte-heros-v2';

	import { Button, FormSplit } from '$UI';
	import { readonlyStore } from '$lib/stores/editing';
	import { changesHistory } from '$lib/stores/history';
	import { activeModeStore, connectionStore, framesDataStore } from '$lib/stores/workspace';

	import Choice from './Choice.svelte';

	export let frameKey: number;

	$: ({ choices } = $framesDataStore[frameKey]);

	const addChoice = () => {
		const choiceId = choices.length ? last(choices).choiceId + 1 : 0;

		$framesDataStore[frameKey].choices = [
			...choices,
			{
				choiceId,
				frameId: null,
				logicOperations: [],
				mathOperations: [],
				text: ''
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
		class={clsx('!text-text', $activeModeStore === 'binding' ? 'bg-main-60' : 'bg-contrast-5')}
		disabled={($activeModeStore === 'binding' && !!$connectionStore) || $readonlyStore}
		on:click={addChoice}
		on:mousedown={(e) => e.stopPropagation()}
		variant="main"
	>
		Добавить вариант
	</Button>
</FormSplit>
