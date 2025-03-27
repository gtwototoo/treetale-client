<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Photo } from 'svelte-heros-v2';

	import Icon from '$lib/ui/Icon.svelte';
	import Image from '$lib/ui/Image.svelte';
	import Popover from '$lib/ui/Popover.svelte';
	import { button as buttonPresets } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	const {
		children,
		imageUrl
	}: {
		children: Snippet;
		imageUrl: null | string;
	} = $props();
</script>

<Popover
	class={clm(
		buttonPresets.type.primary,
		buttonPresets.size.lg,
		'w-full flex-col justify-center',
		imageUrl && 'p-1'
	)}
>
	{#snippet button()}
		{#if imageUrl}
			<Image
				src={imageUrl}
				alt="Мини иллюстрация истории"
				cover
				class="flex h-[4.25rem] w-full flex-col rounded-lg"
			>
				{#snippet error()}
					<Icon class="size-8 text-red-500" this={Photo} variation="solid" />
					<p class="text-xs text-red-500">Ошибка</p>
				{/snippet}
			</Image>
		{:else}
			<Icon class="text-main size-10" this={Photo} variation="solid" />
			<p>Иллюстрация</p>
		{/if}
	{/snippet}
	<div class="flex w-96 flex-col gap-2 p-2">
		{@render children()}
	</div>
</Popover>
