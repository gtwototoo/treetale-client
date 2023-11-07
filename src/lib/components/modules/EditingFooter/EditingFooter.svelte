<script lang="ts">
	import clsx from 'clsx';

	import StateMode from './StateMode.svelte';

	import { Button } from '$UI';
	import { bodyColorStore, redColorStore } from '$lib/stores/main';
	import {
		activeActionStore,
		activeModeStore,
		addFrameOffsetStore,
		offsetStore,
		zoomCorrect,
		zoomStore
	} from '$lib/stores/workspace';
	import { contrastText } from '$lib/utils';

	const cancelAddFrameMode = () => {
		$activeModeStore = 'view';
	};

	const enableAddFrameMode = (e: CustomEvent<MouseEvent>) => {
		const { x, y } = e.detail;
		const cursorCoords = zoomCorrect({ x, y });

		$addFrameOffsetStore = cursorCoords;
		$activeModeStore = 'adding';
	};

	$: greenColor = clsx(contrastText($bodyColorStore) ? 'bg-emerald-900' : 'bg-emerald-200');
</script>

<div class="area">
	<div class={clsx('flex items-center', $activeActionStore ? 'blind' : 'pointer-events-auto')}>
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
	{#if $activeModeStore === 'adding'}
		<Button
			on:click={cancelAddFrameMode}
			variant="ghost"
			size="lg"
			class={clsx('w-64 text-red-500 pointer-events-auto justify-center', $redColorStore)}
		>
			Отмена
		</Button>
	{:else}
		<Button
			on:click={enableAddFrameMode}
			variant="ghost"
			size="lg"
			class={clsx('w-64 text-emerald-500 pointer-events-auto justify-center', greenColor)}
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
