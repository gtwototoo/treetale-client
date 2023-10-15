<script lang="ts">
	import { Button, FormSplit } from '$UI';
	import { changesHistory } from '$lib/stores/editing';
	import { framesDataStore } from '$lib/stores/workspace';
	import { last } from '$lib/utils';
	import clsx from 'clsx';
	import { Plus } from 'svelte-heros-v2';

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
	{#each choices as { text, choiceId } (choiceId)}
		<Button class={clsx('gap-4 truncate', !text && '!text-gray-400')}>
			{text || 'Вариант выбора'}
		</Button>
	{/each}
	<Button on:click={addChoice}>Добавить вариант</Button>
</FormSplit>
