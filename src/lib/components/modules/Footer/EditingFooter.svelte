<script lang="ts">
	import clsx from 'clsx';
	import { Plus, XMark } from 'svelte-heros-v2';

	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { readonlyStore } from '$lib/stores/editing';
	import { bodyColorStore, redColorStore } from '$lib/stores/main';
	import { panelShow } from '$lib/stores/panel';
	import {
		activeActionStore,
		activeModeStore,
		addFrameOffsetStore,
		offsetStore,
		zoomCorrect,
		zoomStore
	} from '$lib/stores/workspace';
	import { contrastText } from '$lib/utils';

	import Radar from './Radar.svelte';
	import StateMode from './StateMode.svelte';

	export let workspaceWidth: number;
	export let workspaceHeight: number;

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

<div class={clsx('area', !$panelShow && 'max-xs:mb-16')}>
	<div
		class={clsx(
			'flex items-center gap-2 rounded-full bg-main ring-4 ring-main',
			$activeActionStore ? 'blind' : 'pointer-events-auto'
		)}
	>
		<Radar bind:workspaceHeight bind:workspaceWidth />
		<div class="mr-4 flex select-none flex-col whitespace-nowrap text-sm text-text">
			<p>
				{Math.round($offsetStore.x)}, {Math.round($offsetStore.y)}
			</p>
			<p>
				{($zoomStore / 100).toFixed(1)}x
			</p>
		</div>
	</div>
	<div class="absolute left-0 flex w-full justify-center px-40">
		{#if !$readonlyStore}
			{#if $activeModeStore === 'adding'}
				<Button
					class={clsx('pointer-events-auto w-64 justify-center text-red-500', $redColorStore)}
					on:click={cancelAddFrameMode}
					size="lg"
					variant="ghost"
				>
					<Icon class="hidden size-6 max-md:block" type={XMark} />
					<p class="max-md:hidden">Отмена</p>
				</Button>
			{:else}
				<Button
					class={clsx('pointer-events-auto w-64 justify-center text-emerald-500', greenColor)}
					on:click={enableAddFrameMode}
					size="lg"
					variant="ghost"
				>
					<Icon class="hidden size-6 max-md:block" type={Plus} />
					<p class="max-md:hidden">Новый блок</p>
				</Button>
			{/if}
		{/if}
	</div>
	<StateMode />
</div>

<style lang="postcss">
	.area {
		@apply pointer-events-none absolute bottom-0 flex w-full items-end justify-between gap-3 bg-transparent p-4 transition-opacity max-sm:p-3;
	}
	.footer {
		@apply flex items-center gap-1;
	}
</style>
