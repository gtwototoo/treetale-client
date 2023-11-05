<script lang="ts">
	import clsx from 'clsx';
	import type { SvelteComponent } from 'svelte';
	import {
		ArrowRightOnRectangle,
		ArrowsPointingOut,
		Cloud,
		Eye,
		Map,
		Share,
		Square3Stack3d
	} from 'svelte-heros-v2';

	import Icon from '$lib/components/Icon.svelte';
	import { ICON_TYPE } from '$lib/constants';
	import { stateAreaStore } from '$lib/stores/newediting';
	import {
		activeActionStore,
		activeModeStore,
		type IAction,
		type IMode
	} from '$lib/stores/workspace';
	import { Tag } from '$UI';
	import Photo from '$UI/Photo.svelte';

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
</script>

<Tag
	class={clsx(
		'flex gap-2 bg-contrast',
		$stateAreaStore === 'saving'
			? 'animate-pulse text-gray-400'
			: $stateAreaStore === 'saved'
			? 'text-emerald-500'
			: $stateAreaStore === 'error'
			? 'text-red-500'
			: 'text-gray-400'
	)}
>
	<Icon
		type={Cloud}
		variation={$stateAreaStore === 'saving' ? ICON_TYPE : 'solid'}
		class={clsx('h-4 w-4')}
	/>
	<Icon type={iconsModes[$activeModeStore]} class="w-4 h-4" />
	{#if $activeActionStore}
		<Icon type={iconsActions[$activeActionStore]} class="w-4 h-4" />
	{/if}
</Tag>
