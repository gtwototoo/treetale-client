<script lang="ts">
	import { clm } from '$lib/utils/classMerge';

	const width = '100%';
	const rx = 12;

	let {
		dragged
	}: {
		dragged: boolean;
	} = $props();
</script>

<svg
	class={clm(
		'absolute left-0 size-full rounded-inherit stroke-contrast stroke-2 transition-colors group-hover:stroke-main',
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
