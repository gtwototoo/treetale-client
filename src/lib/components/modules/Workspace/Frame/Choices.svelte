<script lang="ts">
	import { Button, FormSplit } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { changesHistory } from '$lib/stores/editing';
	import { removeMode } from '$lib/stores/newediting';
	import type { IFrameCreate } from '$lib/types/editing';
	import clsx from 'clsx';
	import { Plus, Trash, XMark } from 'svelte-heros-v2';

	export let data: IFrameCreate;

	const addChoice = () => {
		const choiceId = data.choices.length ? data.choices.at(-1).choiceId + 1 : 0;

		data.choices = [
			...data.choices,
			{
				text: null,
				frameId: null,
				choiceId
			}
		];

		changesHistory.add({
			title: 'Добавление выбора',
			icon: Plus
		});
	};

	const handleClick = (choiceId: number) => {
		if ($removeMode) removeChoice(choiceId);
	};

	const removeChoice = (choiceId: number) => {
		data.choices = data.choices.filter((choice) => choice.choiceId !== choiceId);

		changesHistory.add({
			title: 'Удаление выбора',
			icon: XMark
		});
	};
</script>

<FormSplit vertical>
	{#each data.choices as choice (choice.choiceId)}
		<Button
			on:click={() => handleClick(choice.choiceId)}
			class={clsx('gap-4', {
				'!text-gray-400': !choice.text && !$removeMode,
				'!text-red-600': $removeMode
			})}
		>
			<p class="w-full truncate text-left">
				{choice.text || ($removeMode ? 'Удалить выбор' : 'Вариант выбора')}
			</p>
			{#if $removeMode}
				<Icon type={Trash} class="shrink-0" />
			{/if}
		</Button>
	{/each}
	<Button on:click={addChoice}>Добавить выбор</Button>
</FormSplit>
