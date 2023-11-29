<script lang="ts">
	import clsx from 'clsx';
	import { Plus } from 'svelte-heros-v2';

	import { Button, FormSplit } from '$UI';
	import { changesHistory } from '$lib/stores/history';
	import { bodyColorStore } from '$lib/stores/main';
	import { activeModeStore, connectionStore, framesDataStore } from '$lib/stores/workspace';
	import { clm, contrastText, last } from '$lib/utils';

	export let frameKey: number;

	type HTMLContenteditable = HTMLDivElement & ElementContentEditable;

	$: ({ choices, frameId } = $framesDataStore[frameKey]);

	const choiceFocus = (choiceId: number) => {
		const choiceKey = $framesDataStore[frameKey].choices.findIndex(
			(choice) => choice.choiceId === choiceId
		);
		const choiceInputs: NodeListOf<HTMLContenteditable> = document
			.getElementById('choices')
			.querySelectorAll('[contenteditable]');

		choiceInputs[choiceKey].focus();

		if (choiceInputs[choiceKey].lastChild) {
			const newRange = document.createRange();
			const selection = window.getSelection();

			newRange.setStart(
				choiceInputs[choiceKey].firstChild,
				choiceInputs[choiceKey].innerHTML.length
			);

			selection.removeAllRanges();
			selection.addRange(newRange);
		}
	};

	const handleClick = (choiceId: number) => {
		if ($activeModeStore === 'view') {
			choiceFocus(choiceId);
		}

		if ($activeModeStore === 'binding') {
			if ($connectionStore && $connectionStore.choiceId === choiceId) {
				$connectionStore = null;
				return;
			}

			$connectionStore = {
				frameId,
				choiceId
			};
		}
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

	$: greenHoverColor = contrastText($bodyColorStore)
		? clsx('hover:!bg-emerald-800')
		: clsx('hover:!bg-emerald-200');
	$: greenColor = contrastText($bodyColorStore)
		? clsx('!bg-emerald-800')
		: clsx('!bg-emerald-200');
	$: orangeColor = contrastText($bodyColorStore) ? clsx('bg-orange-800') : clsx('bg-orange-200');
</script>

<FormSplit
	vertical
	class={clsx($activeModeStore === 'binding' ? 'divide-main-80' : 'divide-contrast')}
>
	{#each choices as { text, choiceId, frameId: toFrameId, logicOperations, mathOperations } (choiceId)}
		{@const disabled =
			$activeModeStore === 'binding' &&
			$connectionStore &&
			!($connectionStore.choiceId === choiceId && $connectionStore.frameId === frameId)}
		<Button
			{disabled}
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
			{#if logicOperations.length}
				<div class="absolute left-1 h-7 w-1 rounded-full !bg-orange-500" />
			{/if}
			<p class="truncate">{text || 'Вариант выбора'}</p>
			{#if mathOperations.length}
				<div class="absolute right-1 h-7 w-1 rounded-full !bg-violet-500" />
			{/if}
			{#if $activeModeStore === 'binding'}
				<div class="absolute -right-5 h-6 w-6 rounded-r-full !bg-inherit" />
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
