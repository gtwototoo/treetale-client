<script lang="ts">
	import clsx from 'clsx';
	import { onDestroy } from 'svelte';
	import { Plus } from 'svelte-heros-v2';

	import Icon from '$lib/components/Icon.svelte';
	import { DEFAULT_FRAME_SIZE } from '$lib/constants';
	import { addFrameOffsetStore } from '$lib/stores/workspace';
	import { transform } from '$lib/utils';

	const { width, height } = DEFAULT_FRAME_SIZE;

	onDestroy(() => {
		$addFrameOffsetStore = null;
	});
</script>

<div class="absolute flex justify-center items-center">
	<div
		style:width="{width}px"
		style:height="{height}px"
		style={transform($addFrameOffsetStore)}
		class={clsx(
			'bg-emerald-300/30 text-emerald-500 flex justify-center absolute items-center rounded-lg z-40 transition-[width,height]',
			!$addFrameOffsetStore && '!w-0 !h-0'
		)}
	>
		<Icon type={Plus} class="w-12 h-12 bg-transparent" />
	</div>
</div>
