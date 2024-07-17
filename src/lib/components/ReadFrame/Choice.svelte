<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { Button } from 'treetale-ui';

	let {
		onclick,
		children
	}: {
		onclick: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
		children?: Snippet;
	} = $props();
</script>

<Button
	class="adaptive-font adaptive-padding whitespace-normal bg-main-70 text-left text-text hover:bg-main"
	{onclick}
>
	{@render children?.()}
</Button>
