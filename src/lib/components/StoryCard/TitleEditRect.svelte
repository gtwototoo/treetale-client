<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler, TouchEventHandler } from 'svelte/elements';

	import clamp from 'lodash/clamp';

	let {
		children,
		coverHeigth,
		coverWidth,
		editMode,
		isImage,
		sizes
	}: {
		children: Snippet;
		coverHeigth: number;
		coverWidth: number;
		editMode?: boolean;
		isImage: boolean;
		sizes?: DOMRect;
	} = $props();

	let startOffset = $state({ x: 0, y: 0 });
	let moving = $state(false);
	let offset = $state({ x: 0, y: 0 });

	const handleTouchStart: TouchEventHandler<HTMLDivElement> = (e) => {
		startOffset.x = e.touches[0].clientX - offset.x;
		startOffset.y = e.touches[0].clientY - offset.y;

		moving = true;
	};

	const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
		startOffset.x = e.x - offset.x;
		startOffset.y = e.y - offset.y;

		moving = true;
	};

	const handleMouseUp = () => {
		moving = false;
	};

	const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
		if (!moving || !sizes) return;

		const maxXOffset = (coverWidth - sizes.width - 40) / 2;
		const maxYOffset = (coverHeigth - sizes.height - 24) / 2;

		offset.x = clamp(e.x - startOffset.x, -maxXOffset, maxXOffset);
		offset.y = clamp(e.y - startOffset.y, -maxYOffset - 6, maxYOffset - 6);
	};
</script>

<div
	class="flex size-full cursor-default items-center justify-center"
	style="transform: translate({isImage ? offset.x : 0}px, {isImage ? offset.y : 0}px);"
	onmouseup={handleMouseUp}
	onmousemove={handleMouseMove}
	ontouchstart={handleTouchStart}
	ontouchend={handleMouseUp}
	role="button"
	tabindex="0"
>
	{#if editMode}
		<div
			class="absolute box-content cursor-move bg-contrast/20 px-5 py-3 ring-1 ring-contrast"
			style="width: {sizes?.width}px; height: {sizes?.height}px; top: {(sizes?.y || 0) - 12}px"
			onmousedown={handleMouseDown}
			role="button"
			tabindex="0"
		>
			<div class="dot -left-1 -top-1 cursor-nwse-resize"></div>
			<div class="dot -bottom-1 -left-1 cursor-nesw-resize"></div>
			<div class="dot -right-1 -top-1 cursor-nesw-resize"></div>
			<div class="dot -bottom-1 -right-1 cursor-nwse-resize"></div>
		</div>
	{/if}
	{@render children()}
</div>

<style lang="postcss">
	.dot {
		@apply absolute size-2 rounded-full bg-contrast;
	}
</style>
