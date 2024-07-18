<svelte:options namespace="svg" />

<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	let { ...props }: SVGAttributes<SVGElement> = $props();
</script>

<svg {...props} fill="none" viewBox="0 0 556 442" xmlns="http://www.w3.org/2000/svg">
	<path
		d="M152 442C152 442 148.1 382.34 162 304C179.84 203.48 274 200 274 200V100C137 100 40 0 40 0L0 98C57.48 126.724 96.7 168.435 70 256C35.53 369.05 54 442 54 442H152Z"
		fill="url(#linear-logo)"
	/>
	<path
		d="M404 442C404 442 407.9 382.34 394 304C376.16 203.48 282 200 282 200V100C419 100 516 0 516 0L556 98C498.52 126.724 459.3 168.435 486 256C520.47 369.05 502 442 502 442H404Z"
		fill="url(#linear-logo)"
	/>
</svg>
