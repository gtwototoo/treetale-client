<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Photo } from 'svelte-heros-v2';
	import { Button, Icon, Image, Popover } from 'treetale-ui';

	import { clm } from '$lib/utils/classMerge';

	let {
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
				'w-full flex-col justify-center gap-1 bg-contrast-9 text-text',
				imageUrl && 'p-1'
			)}
			size="lg"
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
				<Icon class="size-8" this={Photo} variation="solid" />
				<p class="text-xs">Иллюстрация</p>
			{/if}
		</Button>
	{/snippet}
	<div class="flex w-96 flex-col gap-2 p-4">
		{@render children()}
	</div>
</Popover>
