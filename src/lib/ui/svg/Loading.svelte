<svelte:options namespace="svg" />

<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	const {
		variation = 'solid',
		...props
	}: {
		variation?: 'outline' | 'solid';
	} & SVGAttributes<SVGElement> = $props();
</script>

<svg
	aria-label="loading"
	fill="none"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
	{...props}
>
	<rect
		class="animate-pulse"
		fill={variation === 'solid' ? 'currentColor' : ''}
		height="16"
		rx="4"
		ry="4"
		stroke={variation === 'outline' ? 'currentColor' : ''}
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width={variation === 'outline' ? '1.5' : ''}
		width="16"
		x="4"
		y="4"
	/>
</svg>
