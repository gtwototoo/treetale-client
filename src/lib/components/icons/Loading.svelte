<svelte:options namespace="svg" />

<script lang="ts">
	let className = '';
	export { className as class };

	export let variation: 'outline' | 'solid' = 'solid';
</script>

<svg
	aria-label="loading"
	class={className}
	fill="none"
	height="24"
	viewBox="0 0 24 24"
	width="24"
	xmlns="http://www.w3.org/2000/svg"
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
