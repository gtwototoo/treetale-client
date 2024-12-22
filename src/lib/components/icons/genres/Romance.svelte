<svelte:options namespace="svg" />

<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	const { ...props }: SVGAttributes<SVGElement> = $props();
</script>

<svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
	<path
		d="M0 12.8v-2.2C1.2 4 8.3 1.7 13.2 6.4c.1.1.3.1.4 0 3.2-3 6.5-3.4 10-1.2 2 1.4 3.2 3.5 3.3 6.5 0 .2 0 .4-.3.4l-2.2.3c-.2 0-.4 0-.5-.2-3.8-4.5-11-2.9-12.1 3-.8 4 1 7.6 3.3 10.6.2.3.2.5 0 .7l-1.3.9c-.2.2-.5.2-.7 0-5.6-4-11.6-7.5-13.1-14.6Z"
		fill="currentColor"
	/>
	<path
		d="M32 18.3v1.5a9 9 0 0 1-5.6 6.4c-2.1 1-4.5 1.7-7.2 2.4-.2 0-.4 0-.6-.2-2.7-3.6-6-7.3-5.7-12a5.6 5.6 0 0 1 10.5-2.6c0 .2.2.2.5.2 4.1-1.3 6.9.1 8.1 4.3Z"
		fill="currentColor"
	/>
</svg>
