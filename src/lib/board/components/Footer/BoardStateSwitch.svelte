<script lang="ts">
	import type { Component } from 'svelte';
	import { fly } from 'svelte/transition';

	import {
		ArrowRightOnRectangle,
		ArrowsPointingOut,
		Eye,
		Map,
		Photo,
		Share,
		Square3Stack3d
	} from 'svelte-heros-v2';

	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	import { connectionStartStore } from '$board/stores/frames.svelte';
	import {
		type ActionType,
		type ModeType,
		boardStateStore,
		isBindingMode
	} from '$board/stores/index.svelte';

	const modesIcons: Record<ModeType, Component> = {
		addingComment: Square3Stack3d,
		addingFrame: Square3Stack3d,
		binding: Share,
		view: Eye
	};

	const actionsIcons: Record<ActionType, Component> = {
		connectTo: ArrowRightOnRectangle,
		dragImage: Photo,
		movingArea: Map,
		movingBlock: ArrowsPointingOut
	};

	const switchConnectionMode = () => {
		boardStateStore.mode = isBindingMode() ? 'view' : 'binding';

		connectionStartStore.clear();
	};
</script>

<Button
	class={clm(button.type.primary, button.size.lg, 'z-10 gap-3 pl-4 max-sm:px-3')}
	onclick={switchConnectionMode}
>
	{#if boardStateStore.action}
		<div class="bg-contrast absolute -top-4 -left-4 rounded-full p-2" in:fly={{ y: 10 }}>
			<Icon class="size-5" this={actionsIcons[boardStateStore.action]} />
		</div>
	{/if}
	<Icon class="size-6" this={modesIcons[boardStateStore.mode]} />
	<p class="max-sm:hidden">{isBindingMode() ? 'Связывание' : 'Просмотр'}</p>
</Button>
