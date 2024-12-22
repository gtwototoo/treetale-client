<script lang="ts">
	import type { Selection } from 'd3-selection';
	import { select } from 'd3-selection';

	import { clm } from '$lib/utils/classMerge';

	import TitleEditRect from './TitleEditRect.svelte';

	const {
		color,
		editMode,
		isImage,
		title
	}: {
		color: string;
		editMode?: boolean;
		isImage: boolean;
		title: string;
	} = $props();

	const coverWidth = 340;
	const coverHeigth = 510;

	let ready = $state(false);
	let sizes = $state<DOMRect>();

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
		const x = element.attr('x');
		const y = element.attr('y');
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

		sizes = node.getBBox();
	};
</script>

<TitleEditRect {sizes} {coverHeigth} {coverWidth} {editMode} {isImage}>
	<svg
		viewBox="0 0 {coverWidth} {coverHeigth}"
		class="pointer-events-none absolute size-auto"
		xmlns="http://www.w3.org/2000/svg"
	>
		{#key title}
			<text
				use:calculateTitleWrap
				x="50%"
				y="50%"
				text-rendering="optimizeSpeed"
				text-anchor="middle"
				class={clm(
					'font-RobotoSlab text-3xl font-black uppercase',
					!ready && 'invisible -z-10',
					color
				)}
			>
				{title || 'Без названия'}
			</text>
		{/key}
	</svg>
</TitleEditRect>

<style lang="postcss">
	text {
		paint-order: stroke;
		@apply stroke-main-80 stroke-[.5rem];
	}
</style>
