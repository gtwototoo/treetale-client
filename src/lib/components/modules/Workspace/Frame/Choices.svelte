<script lang="ts">
	import clsx from 'clsx';
	import { Plus } from 'svelte-heros-v2';

	import { changesHistory } from '$lib/stores/editing';
	import { activeModeStore, connectionStore, framesDataStore } from '$lib/stores/workspace';
	import { clm, last } from '$lib/utils';
	import { Button, FormSplit } from '$UI';

	export let frameKey: number;

	$: ({ choices, frameId } = $framesDataStore[frameKey]);

	const handleClick = (choiceId: number) => {
		$connectionStore = {
			frameId,
			choiceId
		};
	};

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

<FormSplit
	vertical
	class={clsx($activeModeStore === 'binding' ? 'divide-main-60' : 'divide-white')}
>
	{#each choices as { text, choiceId, frameId: toFrameId } (choiceId)}
		<Button
			class={clm(
				'gap-4',
				!text && '!text-gray-400',
				$activeModeStore === 'binding' && 'hover:!bg-emerald-100',
				$activeModeStore === 'binding' && toFrameId && '!bg-orange-100',
				$activeModeStore === 'binding' &&
					$connectionStore &&
					$connectionStore.frameId === frameId &&
					$connectionStore.choiceId === choiceId &&
					'!bg-emerald-100'
			)}
			on:click={() => handleClick(choiceId)}
		>
			<p class="truncate">{text || 'Вариант выбора'}</p>
			{#if $activeModeStore === 'binding'}
				<div class="w-6 h-6 rounded-r-full absolute -right-5 !bg-inherit" />
			{/if}
		</Button>
	{/each}
	<Button on:click={addChoice}>Добавить вариант</Button>
</FormSplit>
