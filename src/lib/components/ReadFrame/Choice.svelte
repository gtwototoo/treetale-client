<script lang="ts">
	import { clm } from '$lib/utils/classMerge';
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { Button } from 'treetale-ui';

	let {
		active,
		onclick,
		children
	}: {
		active: boolean;
		onclick: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
		children?: Snippet;
	} = $props();
</script>

<Button
	class={clm(
		'adaptive-font adaptive-padding whitespace-normal bg-main text-left text-text',
		active && 'bg-main-50'
	)}
	{onclick}
>
	{@render children?.()}
</Button>
