<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Photo } from 'svelte-heros-v2';
	import { Popover } from 'treetale-ui';

	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import Image from '$lib/ui/Image.svelte';
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

<Popover align="left">
	{#snippet button({ onclick })}
		<Button
			class={clm(
				buttonPresets.type.primary,
				buttonPresets.size.lg,
				'w-full flex-col justify-center',
				imageUrl && 'p-1'
			)}
			{onclick}
		>
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
				<p class="text-sm">Иллюстрация</p>
			{/if}
		</Button>
	{/snippet}
	<div class="flex w-96 flex-col gap-2 p-4">
		{@render children()}
	</div>
</Popover>
