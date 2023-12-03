<script lang="ts">
	import clsx from 'clsx';
	import { Share } from 'svelte-heros-v2';

	import Choices from './Choices.svelte';
	import Header from './Header.svelte';

	import { changesHistory } from '$lib/stores/history';
	import { bodyColorStore } from '$lib/stores/main';
	import {
		activeModeStore,
		connectionStore,
		framesDataStore,
		movingFrameStore
	} from '$lib/stores/workspace';
	import { contrastText, transform } from '$lib/utils';
	import { createConnections, getChoicePosition } from '$lib/utils/editing';
	import DOMPurify from 'isomorphic-dompurify';

	export let frameId: number;
	export let index: number;

	$: frameKey = $framesDataStore.findIndex((frame) => frame.frameId === frameId);

	const setMovingFrame = () => {
		$movingFrameStore = frameId;
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

	$: greenColor = clsx(
		contrastText($bodyColorStore) ? 'hover:!bg-emerald-800' : 'hover:!bg-emerald-200'
	);
</script>

{#if frameKey !== -1}
	{@const { choices, hidden, title, text, x, y } = $framesDataStore[frameKey]}
	<div class="absolute" style="{transform({ x, y })}; z-index: {frameId}">
		<button
			class={clsx(
				'relative z-10 flex w-64 cursor-move select-none flex-col items-stretch gap-3 rounded-lg bg-contrast p-2 text-sm/4 text-text transition-[box-shadow] hover:shadow-lg childs:bg-transparent',
				$movingFrameStore === frameId && 'shadow-lg',
				$activeModeStore === 'binding' && '!bg-main-80 text-text',
				$activeModeStore === 'binding' &&
					$connectionStore &&
					$connectionStore.frameId !== frameId &&
					greenColor
			)}
			on:mousedown={setMovingFrame}
			on:click={createConnection}
			bind:clientHeight={$framesDataStore[frameKey].height}
		>
			<Header {hidden} on:hide={setVisible}>
				<p class={clsx('py-1 pl-4', { 'text-emerald-500': !index })}>
					{!index ? 'Начало' : title}
				</p>
			</Header>
			{#if !hidden}
				{#if $framesDataStore[frameKey].imageUrl}
					<img
						alt="Изображение фрейма"
						draggable="false"
						src={$framesDataStore[frameKey].imageUrl}
						class="h-36 w-full rounded-lg object-cover"
					/>
				{/if}
				<div
					class={clsx('flex h-20 items-center px-4 text-center', {
						'text-gray-400': !text
					})}
				>
					<div class="line-clamp-5 w-full break-words text-left">
						{@html DOMPurify.sanitize(text || 'Описание фрейма')}
					</div>
				</div>
				<Choices {frameKey} />
			{/if}
			{#if $activeModeStore === 'binding'}
				<div
					class={clsx(
						'absolute -left-3 h-6 w-6 rounded-l-full !bg-inherit',
						hidden ? 'top-1/2 -mt-3' : 'top-2'
					)}
				/>
				{#if hidden}
					<div class="absolute -right-3 top-1/2 -mt-3 h-6 w-6 rounded-r-full !bg-inherit" />
				{/if}
			{/if}
		</button>
		{#if $activeModeStore !== 'binding'}
			<div class="pointer-events-none absolute inset-0">
				{#if hidden}
					<div class="point right-0 top-1/2" />
				{:else}
					{#each choices as _, key}
						<div
							class="point right-0"
							style:top="{getChoicePosition(key, $framesDataStore[frameKey].imageUrl)}px"
						/>
					{/each}
				{/if}
				<div class={clsx('point left-0', hidden ? 'top-1/2' : 'top-5')} />
			</div>
		{/if}
	</div>
{/if}

<style lang="postcss">
	.point {
		@apply absolute flex items-center justify-center bg-contrast after:absolute after:h-5 after:w-5 after:rounded-full after:bg-inherit;
	}
</style>
