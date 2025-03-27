<script lang="ts">
	import { Slider } from 'melt/builders';

	import { clm } from '$lib/utils/classMerge';

	let {
		class: classname,
		min,
		max,
		value,
		onchange
	}: {
		class?: string;
		min?: number;
		max?: number;
		value?: number;
		onchange?: (value: number) => void;
	} = $props();

	const slider = new Slider({
		max,
		min,
		value,
		onValueChange: (value) => onchange?.(value!)
	});
</script>

<div
	{...slider.root}
	class={clm(
		'bg-main-300 hover:bg-main-400 ring-main-500 relative mx-2 flex h-1 cursor-pointer items-center rounded-full ring-1',
		classname
	)}
>
	<div
		{...slider.thumb}
		class="bg-main-500 hover:bg-main-600 ring-main absolute left-[var(--percentage)] size-4 -translate-x-1/2 rounded-full ring-1"
	></div>
</div>
