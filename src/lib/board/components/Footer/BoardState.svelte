<script lang="ts">
	import { connectionStartStore } from '$board/stores/frames.svelte';
	import {
		type ActionType,
		type ModeType,
		type StateType,
		boardStateStore,
		readonlyModeStore
	} from '$board/stores/index.svelte';
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
	import { Button, type HeroIconComponent, Icon } from 'treetale-ui';

	import { ICON_TYPE } from '$lib/constants';
	import { clm } from '$lib/utils/classMerge';

	const stateColors: Record<StateType, string> = {
		await: 'text-gray-400',
		error: 'text-red-500',
		saved: 'text-emerald-500',
		saving: 'animate-pulse text-gray-400'
	};

	const modesIcons: Record<ModeType, HeroIconComponent> = {
		adding: Square3Stack3d,
		binding: Share,
		view: Eye
	};

	const actionsIcons: Record<ActionType, HeroIconComponent> = {
		connectTo: ArrowRightOnRectangle,
		dragImage: Photo,
		movingArea: Map,
		movingFrame: ArrowsPointingOut
	};

	const switchConnectionMode = () => {
		boardStateStore.mode = boardStateStore.mode === 'binding' ? 'view' : 'binding';

		connectionStartStore.clear();
	};
</script>

<Button
	class={clm('z-10 min-h-0 flex-col gap-1 bg-contrast p-1.5', stateColors[boardStateStore.state])}
	onclick={switchConnectionMode}
>
	{#if boardStateStore.action}
		<Icon class="size-4" this={actionsIcons[boardStateStore.action]} />
	{/if}
	<Icon class="size-4" this={modesIcons[boardStateStore.mode]} />
	{#if !readonlyModeStore.isEnabled}
		<Icon
			class="size-4"
			this={Cloud}
			variation={boardStateStore.state === 'saving' ? ICON_TYPE : 'solid'}
		/>
	{/if}
</Button>
