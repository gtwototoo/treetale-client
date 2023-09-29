<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { correctWhitespace } from '$lib/utils';
	import type { SvelteComponent } from 'svelte';

	export let text: string | undefined = undefined;
	export let icon: typeof SvelteComponent<any>;
</script>

<div class="flex select-none flex-col items-center gap-4 px-4 pb-4 text-center text-sm">
	<Icon type={icon} class="h-12 w-12 text-gray-400" />
	{#if text}
		{correctWhitespace(text)}
	{:else}
		<slot />
	{/if}
</div>
