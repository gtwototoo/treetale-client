<svelte:options namespace="svg" />

<script lang="ts">
	let className = '';
	export { className as class };
</script>

<svg
	aria-label="loading"
	class={className}
	fill="none"
	height="24"
	stroke-width="2"
	viewBox="0 0 24 24"
	width="24"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M6 1H4C3.20435 1 2.44129 1.31607 1.87868 1.87868C1.31607 2.44129 1 3.20435 1 4V6M18 1H20C20.7957 1 21.5587 1.31607 22.1213 1.87868C22.6839 2.44129 23 3.20435 23 4V6M23 18V20C23 20.7957 22.6839 21.5587 22.1213 22.1213C21.5587 22.6839 20.7957 23 20 23H18M6 23H4C3.20435 23 2.44129 22.6839 1.87868 22.1213C1.31607 21.5587 1 20.7957 1 20V18"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="1.5"
	/>
</svg>
