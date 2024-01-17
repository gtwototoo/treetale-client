<script lang="ts">
	import clsx from 'clsx';
	import { Share } from 'svelte-heros-v2';

	import Choices from './Choices.svelte';
	import Header from './Header.svelte';

	import { Image } from '$UI';
	import { readonlyStore } from '$lib/stores/editing';
	import { changesHistory } from '$lib/stores/history';
	import { bodyColorStore, currentPanelStore } from '$lib/stores/main';
	import {
		activeModeStore,
		connectionStore,
		framesDataStore,
		movingFrameStore,
		selectedFrameStore
	} from '$lib/stores/workspace';
	import { contrastText, createConnections, transform } from '$lib/utils';
	import { FrameSettings } from '../../Panel';

	export let frameId: number;
	export let index: number;

	$: frameKey = $framesDataStore.findIndex((frame) => frame.frameId === frameId);
	$: frame = frameKey !== -1 ? $framesDataStore[frameKey] : undefined;

	const setSelectedFrame = () => {
		if (!frame) return;

		if (
			$activeModeStore === 'binding' &&
			$connectionStore &&
			$connectionStore.frameId !== frameId
		) {
			return;
		}

		if (!$readonlyStore) {
			$movingFrameStore = frameId;
		}
		$selectedFrameStore = frameId;

		if ($currentPanelStore.id !== `frame-${frame.frameId}`) {
			$currentPanelStore = {
				id: `frame-${frame.frameId}`,
				title: frame.title || 'Начало',
				component: FrameSettings
			};
		}
	};

	const setVisible = () => {
		$framesDataStore[frameKey].hidden = !$framesDataStore[frameKey].hidden;

		createConnections($framesDataStore);
	};

	const createConnection = () => {
		if (
			$activeModeStore !== 'binding' ||
			!$connectionStore ||
			$connectionStore.frameId === frameId
		)
			return;

		const { frameId: fromFrameId, choiceId } = $connectionStore;

		const fromFrameKey = $framesDataStore.findIndex((frame) => frame.frameId === fromFrameId);
		const fromChoiceKey = $framesDataStore[fromFrameKey].choices.findIndex(
			(choice) => choice.choiceId === choiceId
		);

		$framesDataStore[fromFrameKey].choices[fromChoiceKey].frameId = frameId;
		$connectionStore = null;

		changesHistory.add('Добавление связи', Share);
	};

	$: ({ hidden, title, text, x, y } = frame);
	$: greenColor = clsx(
		contrastText($bodyColorStore) ? 'hover:!bg-emerald-800' : 'hover:!bg-emerald-200'
	);
</script>

<div class="absolute" style="{transform({ x, y })}; z-index: {frameId}">
	<button
		class={clsx(
			'relative z-10 flex w-64 select-none flex-col items-stretch gap-3 rounded-lg bg-contrast p-2 text-sm/4 text-text childs:bg-transparent',
			!$readonlyStore && 'cursor-move transition-[box-shadow] hover:shadow-lg',
			$movingFrameStore === frameId && 'shadow-lg',
			$activeModeStore === 'binding' &&
				clsx(
					'!bg-main-80 text-text',
					$connectionStore && $connectionStore.frameId !== frameId && greenColor
				)
		)}
		on:mousedown={setSelectedFrame}
		on:click={createConnection}
		bind:clientHeight={$framesDataStore[frameKey].height}
	>
		<Header on:hide={setVisible} {hidden} start={!index} {title} />
		{#if !hidden}
			{#if $framesDataStore[frameKey].imageUrl}
				<Image
					alt="Изображение блока"
					src={$framesDataStore[frameKey].imageUrl}
					class="h-36 w-full rounded-lg !bg-main/30 text-text"
					cover
				/>
			{/if}
			<div class={clsx('flex h-20 items-center px-4 text-center', !text && 'text-gray-400')}>
				<div class="line-clamp-5 w-full break-words text-left">
					{@html text || 'Описание блока'}
				</div>
			</div>
			<Choices {frameKey} />
		{/if}
	</button>
</div>
