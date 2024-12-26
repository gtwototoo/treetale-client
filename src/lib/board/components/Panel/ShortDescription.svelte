<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	import { Icon } from 'treetale-ui';

	import { correctWhitespace } from '$lib/utils/text';

	const {
		children,
		icon,
		text
	}: {
		children?: Snippet;
		icon: Component;
		text?: string;
	} = $props();
</script>

<div class="flex select-none items-start gap-2 text-sm">
	<div class="p-2">
		<Icon class="size-6 text-text/50" this={icon} />
	</div>
	{#if children}
		{@render children()}
	{/if}
	{#if text}
		{correctWhitespace(text)}
	{/if}
</div>
