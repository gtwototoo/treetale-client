<svelte:options namespace="svg" />

<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	const { ...props }: SVGAttributes<SVGElement> = $props();
</script>

<svg {...props} viewBox="0 0 81 36" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M58.554 22C56.735 30.016 49.5663 36 41 36C32.4337 36 25.265 30.016 23.446 22H0V14H23.446C25.2649 5.98405 32.4337 0 41 0C49.5664 0 56.7351 5.98405 58.554 14H64V8.91943C64 7.28822 65.8477 6.34307 67.1705 7.29767L79.7529 16.3782C80.859 17.1765 80.859 18.8235 79.7529 19.6218L67.1705 28.7023C65.8477 29.6569 64 28.7118 64 27.0806V22H58.554ZM33.6552 11.9604V16.415H48.3711V11.9604H33.6552ZM33.6552 19.04V23.4945H48.3711V19.04H33.6552Z"
		fill="currentColor"
	/>
</svg>
