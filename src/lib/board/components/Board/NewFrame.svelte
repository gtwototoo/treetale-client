<script lang="ts">
	import { onDestroy } from 'svelte';

	import { addFrameOffsetStore } from '$board/stores/frames.svelte';
	import { transform } from '$board/utils/coordinatesToCss';
	import { Plus } from 'svelte-heros-v2';
	import { Icon } from 'treetale-ui';

	import { DEFAULT_FRAME_SIZE } from '$lib/constants';
	import { clm } from '$lib/utils/classMerge';

	const { height, width } = DEFAULT_FRAME_SIZE;

	onDestroy(() => {
		addFrameOffsetStore.clear();
	});

	let { x, y } = $derived(addFrameOffsetStore);

	let newFrameStyle = $derived(
		[transform({ x, y }), `width: ${width}px;`, `height: ${height}px`].join(';')
	);
</script>

<div class="absolute flex items-center justify-center">
	<div
		class={clm(
			'absolute z-40 flex items-center justify-center rounded-lg bg-emerald-300/30 text-emerald-500 transition-[width,height]',
			!x && !y && '!size-0'
		)}
		style={newFrameStyle}
	>
		<Icon class={clm('size-12', !x && !y && 'invisible')} this={Plus} />
	</div>
</div>
