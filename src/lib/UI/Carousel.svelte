<script lang="ts">
	import { onMount } from 'svelte';

	import { clsx } from 'clsx';

	let className = '';
	export { className as class };

	export let current = 0;

	let carouselRef: HTMLDivElement;
	let ready = false;

	const toItem = (key: number) => {
		if (!carouselRef) return;

		const scrollToElement = carouselRef.querySelector(`#item-${key}`);

		if (!scrollToElement) return;

		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

		scrollToElement.scrollIntoView({
			behavior: mediaQuery.matches || !ready ? 'auto' : 'smooth',
			block: 'center',
			inline: 'center'
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
	bind:this={carouselRef}
	class={clsx('carousel *:shrink-0 *:snap-center', className, {
		invisible: !ready
	})}
	use:addIdToChilds
>
	<slot />
</div>

<style lang="postcss">
	.carousel {
		@apply flex snap-x snap-mandatory items-center overflow-x-auto scrollbar-none;
	}
</style>
