<svelte:options namespace="svg" />

<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	let { ...props }: SVGAttributes<SVGElement> = $props();
</script>

<svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
	<path
		d="M28.7 6.3c.3 9-2.6 21.9-12.3 25h-.8C5.8 28.2 3 15.4 3.2 6.3l.2-.5c4.9-6.1 20.1-6 25-.2.2.2.3.5.3.7Zm-20 8.2a6 6 0 0 0 2.7.8 2 2 0 0 0 1.7-1 8 8 0 0 0 1-2c.1-.6-.1-.8-.7-.6-1.8.5-3.3 1.3-4.7 2.3-.3.2-.3.3 0 .5Zm14.7-.4c-1.5-1.3-3.3-1.8-5.1-2.5-.3 0-.4 0-.4.3.2 1.2.6 2.1 1.3 2.9 1.2 1.2 3 .3 4.2-.3a.2.2 0 0 0 0-.4Zm-12.3 8.8c2.7-2.1 7-2.6 9.6 0a.6.6 0 0 0 .4.1c.3 0 .5-.1.6-.4 0-.3 0-.7-.4-.9-3.3-2.5-6.8-2.5-10.4-.2a1.2 1.2 0 0 0-.6 1v.3a.5.5 0 0 0 .8.1Z"
		fill="currentColor"
	/>
</svg>
