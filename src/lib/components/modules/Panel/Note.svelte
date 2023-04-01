<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { correctWhitespace } from '$lib/utils';
	import type { SvelteComponent } from 'svelte';

	export let text: string | undefined = undefined;
	export let icon: typeof SvelteComponent;
</script>

<div class="flex select-none flex-col items-center gap-2 px-4 pb-4 text-center text-sm">
	<Icon type={icon} class="h-9 w-9" />
	{#if text}
		{correctWhitespace(text)}
	{:else}
		<slot />
	{/if}
</div>
