<script lang="ts">
	import { Button, FormSplit } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { removeModeStore } from '$lib/stores/newediting';
	import type { IChoice } from '$lib/types';
	import { last } from '$lib/utils';
	import clsx from 'clsx';
	import { createEventDispatcher } from 'svelte';
	import { Trash } from 'svelte-heros-v2';

	export let choices: IChoice[];

	const dispatch = createEventDispatcher();

	const addChoice = () => {
		const choiceId = choices.length ? last(choices).choiceId + 1 : 0;

		dispatch('change', [
			...choices,
			{
				text: null,
				frameId: null,
				choiceId
			}
		]);
	};

	const handleClick = (choiceId: number) => {
		if ($removeModeStore) removeChoice(choiceId);
	};

	const removeChoice = (choiceId: number) => {
		dispatch(
			'change',
			choices.filter((choice) => choice.choiceId !== choiceId)
		);
	};
</script>

<FormSplit vertical>
	{#each choices as choice (choice.choiceId)}
		<Button
			on:click={() => handleClick(choice.choiceId)}
			class={clsx('gap-4', {
				'!text-gray-400': !choice.text && !$removeModeStore,
				'!text-red-600': $removeModeStore
			})}
		>
			<p class="w-full truncate text-left">
				{choice.text || ($removeModeStore ? 'Удалить выбор' : 'Вариант выбора')}
			</p>
			{#if $removeModeStore}
				<Icon type={Trash} class="shrink-0" />
			{/if}
		</Button>
	{/each}
	<Button on:click={addChoice}>Добавить вариант</Button>
</FormSplit>
