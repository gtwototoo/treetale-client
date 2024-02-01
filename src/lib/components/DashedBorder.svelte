<script lang="ts">
	import clsx from 'clsx';

	const width = '100%';
	const rx = 12;

	export let dragged: boolean;
</script>

<svg
	class={clsx(
		'absolute left-0 h-full w-full rounded-inherit stroke-contrast stroke-2 transition-colors group-hover:stroke-main',
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
