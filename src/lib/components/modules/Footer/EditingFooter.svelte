<script lang="ts">
	import clsx from 'clsx';

	import StateMode from './StateMode.svelte';

	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { readonlyStore } from '$lib/stores/editing';
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
	import { Plus } from 'svelte-heros-v2';

	const cancelAddFrameMode = () => {
		$activeModeStore = 'view';
	};

	const enableAddFrameMode = (e: CustomEvent<MouseEvent>) => {
		const { x, y } = e.detail;
		const cursorCoords = zoomCorrect({ x, y });

		$addFrameOffsetStore = cursorCoords;
		$activeModeStore = 'adding';
	};

	$: greenColor = contrastText($bodyColorStore) ? clsx('bg-emerald-900') : clsx('bg-emerald-200');
</script>

<div class="area">
	<div class={clsx('flex items-center', $activeActionStore ? 'blind' : 'pointer-events-auto')}>
		<slot />
		<div class="info whitespace-nowrap">
			<p>
				{Math.round($offsetStore.x)}, {Math.round($offsetStore.y)}
			</p>
			<p>
				{($zoomStore / 100).toFixed(1)}x
			</p>
		</div>
	</div>
	{#if !$readonlyStore}
		{#if $activeModeStore === 'adding'}
			<Button
				on:click={cancelAddFrameMode}
				variant="ghost"
				size="lg"
				class={clsx('pointer-events-auto w-64 justify-center text-red-500', $redColorStore)}
			>
				Отмена
			</Button>
		{:else}
			<Button
				on:click={enableAddFrameMode}
				variant="ghost"
				size="lg"
				class={clsx('pointer-events-auto w-64 justify-center text-emerald-500', greenColor)}
			>
				<Icon type={Plus} class="hidden h-6 w-6 max-md:block" />
				<p class="max-md:hidden">Новый фрейм</p>
			</Button>
		{/if}
	{/if}
	<StateMode />
</div>

<style lang="postcss">
	.area {
		@apply pointer-events-none absolute bottom-0 flex w-full items-end justify-between gap-3 bg-transparent p-2 transition-opacity sm:p-4;
	}
	.footer {
		@apply flex items-center gap-1;
	}
	.info {
		@apply flex select-none flex-col rounded-lg bg-main px-2 py-1 text-sm text-text;
	}
</style>
