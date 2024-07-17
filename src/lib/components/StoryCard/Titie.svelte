<script lang="ts">
	import type { Selection } from 'd3-selection';

	import { select } from 'd3-selection';

	import { clm } from '$lib/utils/classMerge';

	let {
		color,
		title = 'Без названия'
	}: {
		color: string;
		title: string;
	} = $props();

	let ready = $state(false);

	const wrapText = (
		element: Selection<SVGTextElement, unknown, null, undefined>,
		maxWidth: number,
		lineHeight: number,
		unit = 'px'
	) => {
		let word,
			line: string[] = [],
			lineNumber = 0;

		const words = element.text().split(/\s+/).reverse();
		const x = element.attr('x'),
			y = element.attr('y');
		const dy = `${++lineNumber * lineHeight}${unit}`;

		element.text(null);

		let tspan = element.append('tspan').attr('x', x).attr('y', y).attr('dy', 0);

		while ((word = words.pop())) {
			line.push(word);
			tspan.text(line.join(' '));

			let node = tspan.node();

			if (!node) continue;

			const { width } = node.getBBox();

			if (width > maxWidth) {
				line.pop();
				tspan.text(line.join(' '));
				line = [word];
				tspan = element.append('tspan').attr('x', x).attr('y', y).attr('dy', dy).text(word);
			}
		}
	};

	const calculateTitleWrap = (node: SVGTextElement) => {
		wrapText(select(node), 300, 36);

		ready = true;
	};
</script>

<svg
	viewBox="0 0 340 510"
	width="340"
	height="510"
	class="absolute size-full"
	xmlns="http://www.w3.org/2000/svg"
>
	<text
		use:calculateTitleWrap
		x="50%"
		y="50%"
		text-anchor="middle"
		class={clm(
			'font-RobotoSlab text-3xl font-black uppercase',
			!ready && 'invisible -z-10',
			color
		)}
	>
		{title}
	</text>
</svg>

<style lang="postcss">
	text {
		paint-order: stroke;
		@apply stroke-main-80 stroke-[.5rem];
	}
</style>
