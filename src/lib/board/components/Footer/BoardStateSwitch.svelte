<script lang="ts">
	import { fly } from 'svelte/transition';

	import { connectionStartStore } from '$board/stores/frames.svelte';
	import {
		type ActionType,
		type ModeType,
		boardStateStore,
		isBinding
	} from '$board/stores/index.svelte';
	import {
		ArrowRightOnRectangle,
		ArrowsPointingOut,
		Eye,
		Map,
		Photo,
		Share,
		Square3Stack3d
	} from 'svelte-heros-v2';
	import { Button, type HeroIconComponent, Icon } from 'treetale-ui';

	const modesIcons: Record<ModeType, HeroIconComponent> = {
		addingComment: Square3Stack3d,
		addingFrame: Square3Stack3d,
		binding: Share,
		view: Eye
	};

	const actionsIcons: Record<ActionType, HeroIconComponent> = {
		connectTo: ArrowRightOnRectangle,
		dragImage: Photo,
		movingArea: Map,
		movingBlock: ArrowsPointingOut
	};

	const switchConnectionMode = () => {
		boardStateStore.mode = isBinding() ? 'view' : 'binding';

		connectionStartStore.clear();
	};
</script>

<Button
	size="lg"
	class="z-10 gap-3 bg-main-70 pl-4 text-text hover:bg-main-90 max-sm:px-3"
	onclick={switchConnectionMode}
>
	{#if boardStateStore.action}
		<div class="absolute -left-4 -top-4 rounded-full bg-contrast p-2" in:fly={{ y: 10 }}>
			<Icon class="size-5" this={actionsIcons[boardStateStore.action]} />
		</div>
	{/if}
	<Icon class="size-6" this={modesIcons[boardStateStore.mode]} />
	<p class="max-sm:hidden">{isBinding() ? 'Связывание' : 'Просмотр'}</p>
</Button>
