<script lang="ts">
	import { onDestroy } from 'svelte';

	import { Plus } from 'svelte-heros-v2';
	import { Icon } from 'treetale-ui';

	import {
		DEFAULT_BLOCK_WIDTH,
		DEFAULT_COMMENT_HEIGHT,
		DEFAULT_FRAME_HEIGHT
	} from '$lib/constants';
	import { clm } from '$lib/utils/classMerge';

	import { addBlockOffsetStore } from '$board/stores/blocks.svelte';
	import { boardStateStore } from '$board/stores/index.svelte';
	import { transform } from '$board/utils/coordinatesToCss';

	const height =
		boardStateStore.mode === 'addingComment' ? DEFAULT_COMMENT_HEIGHT : DEFAULT_FRAME_HEIGHT;

	onDestroy(() => {
		addBlockOffsetStore.clear();
	});

	let { x, y } = $derived(addBlockOffsetStore);

	let newFrameStyle = $derived(
		[transform({ x, y }), `width: ${DEFAULT_BLOCK_WIDTH}px;`, `height: ${height}px`].join(';')
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
		<Icon class={clm('size-6', !x && !y && 'invisible')} this={Plus} />
	</div>
</div>
