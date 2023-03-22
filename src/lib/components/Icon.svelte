<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	const ICON_TYPE = 'outline';

	let classes: string = '';

	export let type: typeof SvelteComponent;
	export { classes as class };
</script>

<svelte:component this={type} variation={ICON_TYPE} class={classes} />
