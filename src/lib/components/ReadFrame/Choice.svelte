<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	import { Button } from 'treetale-ui';

	let {
		children,
		onclick
	}: {
		children?: Snippet;
		onclick: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
	} = $props();
</script>

<Button
	class="adaptive-font adaptive-padding whitespace-normal bg-main-70 text-left text-text hover:bg-main"
	{onclick}
>
	{@render children?.()}
</Button>
