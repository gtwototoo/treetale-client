<script lang="ts">
	import clsx from 'clsx';
	import { Plus } from 'svelte-heros-v2';

	import { Button, FormSplit } from '$UI';
	import { changesHistory } from '$lib/stores/editing';
	import { bodyColorStore } from '$lib/stores/main';
	import { activeModeStore, connectionStore, framesDataStore } from '$lib/stores/workspace';
	import { clm, contrastText, last } from '$lib/utils';

	export let frameKey: number;

	$: ({ choices, frameId } = $framesDataStore[frameKey]);

	const handleClick = (choiceId: number) => {
		if ($connectionStore && $connectionStore.choiceId === choiceId) {
			$connectionStore = null;
			return;
		}

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

	$: greenHoverColor = clsx(
		contrastText($bodyColorStore) ? 'hover:!bg-emerald-800' : 'hover:!bg-emerald-200'
	);
	$: greenColor = clsx(contrastText($bodyColorStore) ? '!bg-emerald-800' : '!bg-emerald-200');
	$: orangeColor = clsx(contrastText($bodyColorStore) ? 'bg-orange-800' : 'bg-orange-200');
</script>

<FormSplit
	vertical
	class={clsx($activeModeStore === 'binding' ? 'divide-main-80' : 'divide-contrast')}
>
	{#each choices as { text, choiceId, frameId: toFrameId } (choiceId)}
		<Button
			disabled={$activeModeStore === 'binding' &&
				$connectionStore &&
				!($connectionStore.choiceId === choiceId && $connectionStore.frameId === frameId)}
			variant={$activeModeStore === 'binding' ? 'main' : 'ghost'}
			class={clm(
				'gap-4',
				!text ? '!text-gray-400' : '!text-text',
				$activeModeStore === 'binding' ? clsx('bg-main-60', greenHoverColor) : 'bg-main',
				$activeModeStore === 'binding' && toFrameId && orangeColor,
				$activeModeStore === 'binding' &&
					$connectionStore &&
					$connectionStore.frameId === frameId &&
					$connectionStore.choiceId === choiceId &&
					greenColor
			)}
			on:click={() => handleClick(choiceId)}
		>
			<p class="truncate">{text || 'Вариант выбора'}</p>
			{#if $activeModeStore === 'binding'}
				<div class="w-6 h-6 rounded-r-full absolute -right-5 !bg-inherit" />
			{/if}
		</Button>
	{/each}
	<Button
		disabled={$activeModeStore === 'binding' && !!$connectionStore}
		variant={$activeModeStore === 'binding' ? 'main' : 'ghost'}
		class={clsx('!text-text', $activeModeStore === 'binding' ? 'bg-main-60' : 'bg-main')}
		on:click={addChoice}
	>
		Добавить вариант
	</Button>
</FormSplit>
