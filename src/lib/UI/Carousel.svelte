<script lang="ts">
	import { clsx } from 'clsx';
	import { onMount } from 'svelte';

	let classes: string = '';
	export { classes as class };
	export let current: number = 0;

	let carouselRef: HTMLDivElement;
	let ready: boolean = false;

	const toItem = (key: number) => {
		if (!carouselRef) return;

		const scrollToElement = carouselRef.querySelector(`#item-${key}`);

		if (!scrollToElement) return;

		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

		scrollToElement.scrollIntoView({
			block: 'center',
			inline: 'center',
			behavior: mediaQuery.matches || !ready ? 'auto' : 'smooth'
		});
	};

	const addIdToChilds = (node: HTMLDivElement) => {
		for (const [key, child] of Object.entries(node.children)) {
			if (child instanceof Element) {
				child.setAttribute('id', `item-${key}`);
			}
		}
	};

	onMount(() => {
		toItem(current);
		ready = true;
	});

	$: toItem(current);
</script>

<div
	class={clsx('carousel childs:shrink-0 childs:snap-center', classes, {
		invisible: !ready
	})}
	bind:this={carouselRef}
	use:addIdToChilds
>
	<slot />
</div>

<style lang="postcss">
	.carousel {
		@apply scrollbar-none flex snap-x snap-mandatory items-center overflow-x-auto;
	}
</style>
