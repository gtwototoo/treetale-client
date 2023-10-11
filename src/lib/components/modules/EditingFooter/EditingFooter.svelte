<script lang="ts">
	import { Button } from '$UI';
	import {
		activeActionStore,
		addFrameOffsetStore,
		offsetStore,
		zoomCorrect,
		zoomStore
	} from '$lib/stores/workspace';
	import clsx from 'clsx';
	import StateMode from './StateMode.svelte';

	const cancelAddFrameMode = () => {
		$activeActionStore = 'view';
	};

	const enableAddFrameMode = (e: CustomEvent<MouseEvent>) => {
		const { x, y } = e.detail;
		const cursorCoords = zoomCorrect({ x, y });

		$addFrameOffsetStore = cursorCoords;
		$activeActionStore = 'adding';
	};
</script>

<div class="area">
	<div
		class={clsx(
			'flex items-center',
			$activeActionStore !== 'view' ? 'blind' : 'pointer-events-auto'
		)}
	>
		<slot />
		<div class="info">
			<p>
				{$offsetStore.x}, {$offsetStore.y}
			</p>
			<p>
				{($zoomStore / 100).toFixed(1)}x
			</p>
		</div>
	</div>
	{#if $activeActionStore === 'adding'}
		<Button
			on:click={cancelAddFrameMode}
			variant="ghost"
			size="lg"
			class="w-64 bg-red-400 text-red-500 pointer-events-auto justify-center"
		>
			Отмена
		</Button>
	{:else}
		<Button
			on:click={enableAddFrameMode}
			variant="ghost"
			size="lg"
			class="w-64 bg-emerald-300 text-emerald-500 pointer-events-auto justify-center"
		>
			Новый фрейм
		</Button>
	{/if}
	<StateMode />
</div>

<style lang="postcss">
	.area {
		@apply pointer-events-none absolute bottom-0 flex w-full items-center justify-between bg-transparent p-2 transition-opacity sm:p-4;
	}
	.footer {
		@apply flex items-center gap-1;
	}
	.info {
		@apply flex select-none flex-col rounded-lg bg-main px-2 py-1 text-sm text-text;
	}
</style>
