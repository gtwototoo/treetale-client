<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	import { Button } from 'treetale-ui';

	let {
		children,
		disabled,
		loading,
		onclick
	}: {
		children?: Snippet;
		disabled?: boolean;
		loading?: boolean;
		onclick: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
	} = $props();
</script>

<Button
	class="adaptive-font adaptive-padding whitespace-normal bg-main-70 text-left text-text hover:bg-main"
	{onclick}
	{loading}
	{disabled}
>
	{@render children?.()}
</Button>
