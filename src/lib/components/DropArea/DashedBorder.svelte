<script lang="ts">
	import { clm } from '$lib/utils/classMerge';

	const width = '100%';
	const rx = 12;

	const {
		dragged
	}: {
		dragged: boolean;
	} = $props();
</script>

<svg
	class={clm(
		'rounded-inherit stroke-contrast group-hover/drop:stroke-main absolute left-0 size-full stroke-2 transition-colors',
		dragged && '!stroke-main'
	)}
	{rx}
	ry={rx}
	stroke-dasharray="8,16"
	stroke-dashoffset="10.5"
	stroke-linecap="square"
	fill="none"
>
	<rect {width} height={width} {rx} ry={rx} />
</svg>
