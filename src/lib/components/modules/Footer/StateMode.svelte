<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import clsx from 'clsx';
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

	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { ICON_TYPE } from '$lib/constants';
	import { readonlyStore, stateAreaStore } from '$lib/stores/editing';
	import {
		type IAction,
		type IMode,
		activeActionStore,
		activeModeStore,
		connectionStore
	} from '$lib/stores/workspace';

	const iconsModes: Record<IMode, typeof SvelteComponent<unknown>> = {
		adding: Square3Stack3d,
		binding: Share,
		view: Eye
	};

	const iconsActions: Record<IAction, typeof SvelteComponent<unknown>> = {
		connectTo: ArrowRightOnRectangle,
		dragImage: Photo,
		movingArea: Map,
		movingFrame: ArrowsPointingOut
	};

	const switchConnectionMode = () => {
		$activeModeStore = $activeModeStore === 'binding' ? 'view' : 'binding';
		$connectionStore = null;
	};
</script>

<Button
	class={clsx(
		'pointer-events-auto !min-h-0 flex-col gap-1 bg-contrast !p-1.5',
		{
			await: 'text-gray-400',
			error: 'text-red-500',
			saved: 'text-emerald-500',
			saving: 'animate-pulse text-gray-400'
		}[$stateAreaStore]
	)}
	on:click={switchConnectionMode}
	variant="ghost"
>
	{#if $activeActionStore}
		<Icon class="h-4 w-4" type={iconsActions[$activeActionStore]} />
	{/if}
	<Icon class="h-4 w-4" type={iconsModes[$activeModeStore]} />
	{#if !$readonlyStore}
		<Icon
			class={clsx('h-4 w-4')}
			type={Cloud}
			variation={$stateAreaStore === 'saving' ? ICON_TYPE : 'solid'}
		/>
	{/if}
</Button>
