<svelte:options namespace="svg" />

<script lang="ts">
	let className = '';
	export { className as class };
	export let variation: 'solid' | 'outline' = 'solid';
</script>

<svg
	class={className}
	xmlns="http://www.w3.org/2000/svg"
	width="24"
	height="24"
	aria-label="loading"
	fill="none"
	viewBox="0 0 24 24"
>
	<rect
		width="16"
		height="16"
		x="4"
		y="4"
		rx="4"
		ry="4"
		class="animate-pulse"
		fill={variation === 'solid' ? 'currentColor' : ''}
		stroke={variation === 'outline' ? 'currentColor' : ''}
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width={variation === 'outline' ? '1.5' : ''}
	/>
</svg>
