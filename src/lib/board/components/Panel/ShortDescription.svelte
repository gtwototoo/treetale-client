<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	import Icon from '$lib/ui/Icon.svelte';
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

<div class="flex items-start gap-2 text-sm select-none">
	<div class="p-2">
		<Icon class="text-text/50 size-6" this={icon} />
	</div>
	{#if children}
		{@render children()}
	{/if}
	{#if text}
		{correctWhitespace(text)}
	{/if}
</div>
