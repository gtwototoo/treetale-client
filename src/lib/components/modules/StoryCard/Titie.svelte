<script lang="ts">
	import type { Selection } from 'd3-selection';

	import clsx from 'clsx';
	import { select } from 'd3-selection';

	export let title: string;
	export let textColor: string;

	let ready = false;

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

			const { width } = tspan.node().getBBox();

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
		class={clsx(
			'font-RobotoSlab text-3xl font-black uppercase',
			!ready && 'invisible -z-10',
			textColor
		)}
	>
		{title || 'Без названия'}
	</text>
</svg>

<style lang="postcss">
	text {
		paint-order: stroke;
		@apply stroke-main-80 stroke-[.5rem];
	}
</style>
