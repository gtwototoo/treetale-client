<script lang="ts">
	import clsx from 'clsx';
	import type { SvelteComponent } from 'svelte';
	import {
		ArrowRightOnRectangle,
		ArrowsPointingOut,
		Cloud,
		Eye,
		Map,
		Photo,
		Share,
		Square3Stack3d
	} from 'svelte-heros-v2';

	import Icon from '$lib/components/Icon.svelte';
	import { ICON_TYPE } from '$lib/constants';
	import { readonlyStore, stateAreaStore } from '$lib/stores/editing';
	import {
		activeActionStore,
		activeModeStore,
		connectionStore,
		type IAction,
		type IMode
	} from '$lib/stores/workspace';
	import { Button } from '$UI';

	const iconsModes: Record<IMode, typeof SvelteComponent<unknown>> = {
		binding: Share,
		view: Eye,
		adding: Square3Stack3d
	};

	const iconsActions: Record<IAction, typeof SvelteComponent<unknown>> = {
		movingArea: Map,
		movingFrame: ArrowsPointingOut,
		dragImage: Photo,
		connectTo: ArrowRightOnRectangle
	};

	const switchConnectionMode = () => {
		$activeModeStore = $activeModeStore === 'binding' ? 'view' : 'binding';
		$connectionStore = null;
	};
</script>

<Button
	variant="ghost"
	class={clsx(
		'pointer-events-auto flex-col gap-1 bg-contrast !p-1.5',
		{
			saving: 'animate-pulse text-gray-400',
			saved: 'text-emerald-500',
			error: 'text-red-500',
			await: 'text-gray-400'
		}[$stateAreaStore]
	)}
	on:click={switchConnectionMode}
>
	{#if $activeActionStore}
		<Icon type={iconsActions[$activeActionStore]} class="h-4 w-4" />
	{/if}
	<Icon type={iconsModes[$activeModeStore]} class="h-4 w-4" />
	{#if !$readonlyStore}
		<Icon
			type={Cloud}
			variation={$stateAreaStore === 'saving' ? ICON_TYPE : 'solid'}
			class={clsx('h-4 w-4')}
		/>
	{/if}
</Button>
