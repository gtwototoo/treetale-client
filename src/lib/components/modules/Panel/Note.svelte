<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import Icon from '$lib/components/Icon.svelte';
	import { correctWhitespace } from '$lib/utils';

	export let text: string | undefined = undefined;
	export let icon: typeof SvelteComponent<unknown>;
</script>

<div class="flex select-none flex-col items-center gap-4 px-4 pb-4 text-center text-sm">
	<Icon class="h-12 w-12 text-contrast-9" type={icon} />
	{#if text}
		{correctWhitespace(text)}
	{:else}
		<slot />
	{/if}
</div>
