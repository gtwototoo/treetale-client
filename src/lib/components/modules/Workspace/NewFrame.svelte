<script lang="ts">
	import { onDestroy } from 'svelte';

	import clsx from 'clsx';
	import { Plus } from 'svelte-heros-v2';

	import Icon from '$lib/components/Icon.svelte';
	import { DEFAULT_FRAME_SIZE } from '$lib/constants';
	import { addFrameOffsetStore } from '$lib/stores/workspace';
	import { transform } from '$lib/utils';

	const { height, width } = DEFAULT_FRAME_SIZE;

	onDestroy(() => {
		$addFrameOffsetStore = null;
	});
</script>

<div class="absolute flex items-center justify-center">
	<div
		class={clsx(
			'absolute z-40 flex items-center justify-center rounded-lg bg-emerald-300/30 text-emerald-500 transition-[width,height]',
			!$addFrameOffsetStore && '!h-0 !w-0'
		)}
		style={transform($addFrameOffsetStore)}
		style:height="{height}px"
		style:width="{width}px"
	>
		<Icon class="h-12 w-12 bg-transparent" type={Plus} />
	</div>
</div>
