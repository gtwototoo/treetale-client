<script lang="ts">
	import clsx from 'clsx';
	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';
	import { Share } from 'svelte-heros-v2';

	import type { IFrameCreate } from '$lib/types/editing';

	import { Image } from '$UI';
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

	import { connectedWithStart, setSelectedFrame } from '../methods';
	import Choices from './Choices.svelte';
	import Header from './Header.svelte';

	export let frameId: number;

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
		frame.hidden = !frame.hidden;
		$framesDataStore = $framesDataStore;

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

		const frame = find($framesDataStore, { frameId: fromFrameId });
		const choice = find(frame.choices, { choiceId });

		choice.frameId = frameId;
		$framesDataStore = $framesDataStore;

		$connectionStore = null;

		changesHistory.add('Добавление связи', Share);
	};

	$: isEndFrame = connectedWithStart(frameId) && !$framesDataStore[frameKey].choices.length;
	$: frameKey = findIndex($framesDataStore, { frameId });
	$: frame = frameKey !== -1 ? $framesDataStore[frameKey] : undefined;
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
				'relative z-10 flex w-64 select-none flex-col items-stretch gap-3 rounded-lg bg-contrast p-2 text-sm/4 text-text *:bg-transparent',
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
			<Header {frame} on:hide={setVisible} start={frameId === 1} end={isEndFrame} />
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
