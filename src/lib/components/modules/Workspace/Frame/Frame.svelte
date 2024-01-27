<script lang="ts">
	import clsx from 'clsx';
	import { Share } from 'svelte-heros-v2';

	import type { IFrameCreate } from '$lib/types/editing';

	import { readonlyStore } from '$lib/stores/editing';
	import { changesHistory } from '$lib/stores/history';
	import { bodyColorStore } from '$lib/stores/main';
	import { panelStore } from '$lib/stores/panel';
	import {
		activeModeStore,
		connectionStore,
		framesDataStore,
		movingFrameStore
	} from '$lib/stores/workspace';
	import { contrastText, createConnections, transform } from '$lib/utils';
	import { Image } from '$UI';

	import { setSelectedFrame } from '../methods';
	import Choices from './Choices.svelte';
	import Header from './Header.svelte';

	export let frameId: number;
	export let index: number;

	$: frameKey = $framesDataStore.findIndex((frame) => frame.frameId === frameId);
	$: frame = frameKey !== -1 ? $framesDataStore[frameKey] : undefined;

	const handleMouseDown = () => {
		if (!frame) return;

		if (
			$activeModeStore === 'binding' &&
			$connectionStore &&
			$connectionStore.frameId !== frame.frameId
		) {
			return;
		}

		if (!$readonlyStore) {
			$movingFrameStore = frame.frameId;
		}

		if ($panelStore.id !== `frame-${frame.frameId}`) {
			setSelectedFrame(frame);
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

		const { choiceId, frameId: fromFrameId } = $connectionStore;

		const fromFrameKey = $framesDataStore.findIndex((frame) => frame.frameId === fromFrameId);
		const fromChoiceKey = $framesDataStore[fromFrameKey].choices.findIndex(
			(choice) => choice.choiceId === choiceId
		);

		$framesDataStore[fromFrameKey].choices[fromChoiceKey].frameId = frameId;
		$connectionStore = null;

		changesHistory.add('Добавление связи', Share);
	};

	$: ({ hidden, imageUrl, text, x, y } = frame || ({} as IFrameCreate));
	$: greenColor = clsx(
		contrastText($bodyColorStore) ? 'hover:!bg-emerald-800' : 'hover:!bg-emerald-200'
	);
</script>

{#if frame}
	<div class="absolute" style="{transform({ x, y })}; z-index: {frameId}">
		<button
			bind:clientHeight={$framesDataStore[frameKey].height}
			class={clsx(
				'relative z-10 flex w-64 select-none flex-col items-stretch gap-3 rounded-lg bg-contrast p-2 text-sm/4 text-text childs:bg-transparent',
				!$readonlyStore && 'cursor-move transition-[box-shadow] hover:shadow-lg',
				$movingFrameStore === frameId && 'shadow-lg',
				$activeModeStore === 'binding' &&
					clsx(
						'!bg-main-70 text-text',
						$connectionStore && $connectionStore.frameId !== frameId && greenColor
					)
			)}
			on:click={createConnection}
			on:mousedown={handleMouseDown}
		>
			<Header {frame} on:hide={setVisible} start={!index} />
			{#if !hidden}
				{#if imageUrl}
					<Image
						alt="Изображение блока"
						class="h-36 w-full rounded-lg !bg-main/30 text-text"
						cover
						src={$framesDataStore[frameKey].imageUrl}
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
{/if}
