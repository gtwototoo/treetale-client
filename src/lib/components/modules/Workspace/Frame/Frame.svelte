<script lang="ts">
	import { changesHistory } from '$lib/stores/editing';
	import {
		activeModeStore,
		connectionStore,
		framesDataStore,
		movingFrameStore
	} from '$lib/stores/workspace';
	import { transform } from '$lib/utils';
	import { createConnections, getChoicePosition } from '$lib/utils/editing';
	import clsx from 'clsx';
	import { Share } from 'svelte-heros-v2';
	import Choices from './Choices.svelte';
	import Header from './Header.svelte';

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
</script>

{#if frameKey !== -1}
	{@const { choices, hidden, title, text, x, y } = $framesDataStore[frameKey]}
	<div class="absolute" style="{transform({ x, y })}; z-index: {frameId}">
		<button
			class={clsx(
				'relative z-10 flex w-64 cursor-move select-none flex-col items-stretch gap-3 rounded-lg bg-white p-2 text-sm/4 transition-[box-shadow,background-color] hover:shadow-lg childs:bg-transparent',
				$movingFrameStore === frameId && 'shadow-lg',
				$activeModeStore === 'binding' && '!bg-main-60',
				$activeModeStore === 'binding' &&
					$connectionStore &&
					$connectionStore.frameId !== frameId &&
					'hover:!bg-emerald-100'
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
				<div
					class={clsx('flex h-20 items-center px-4 text-center', {
						'text-gray-400': !text
					})}
				>
					<p class="line-clamp-5 w-full break-words">{text || 'Описание фрейма'}</p>
				</div>
				<Choices {frameKey} />
			{/if}
			{#if $activeModeStore === 'binding'}
				<div
					class={clsx(
						'w-6 h-6 rounded-l-full absolute -left-3 !bg-inherit',
						hidden ? 'top-1/2 -mt-3' : 'top-2'
					)}
				/>
				{#if hidden}
					<div class="w-6 h-6 rounded-r-full absolute -right-3 !bg-inherit top-1/2 -mt-3" />
				{/if}
			{/if}
		</button>
		{#if $activeModeStore !== 'binding'}
			<div class="absolute inset-0 pointer-events-none">
				{#if hidden}
					<div class="point right-0 top-1/2" />
				{:else}
					{#each choices as _, key}
						<div class="point right-0" style:top="{getChoicePosition(key)}px" />
					{/each}
				{/if}
				<div class={clsx('point left-0', hidden ? 'top-1/2' : 'top-5')} />
			</div>
		{/if}
	</div>
{/if}

<style lang="postcss">
	.point {
		@apply absolute flex items-center justify-center bg-white after:absolute after:h-5 after:w-5 after:rounded-full after:bg-inherit;
	}
</style>
