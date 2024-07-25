<script lang="ts">
	import { Tag } from 'treetale-ui';

	import type { Variable } from '$lib/types';

	import { correctVariableReplace } from '$lib/utils/text';

	let {
		description,
		tags,
		vars
	}: {
		description: string;
		tags: string[];
		vars: Variable[];
	} = $props();
</script>

<div class="absolute inset-0 overflow-hidden rounded-inherit">
	<div
		class="absolute bottom-0 flex max-h-full w-full translate-y-full flex-col gap-3 bg-contrast px-4 py-10 text-center transition-transform group-hover:translate-y-0"
	>
		<div class="clear-text overflow-hidden text-ellipsis text-base text-text max-md:text-sm">
			{@html correctVariableReplace(description, vars) || 'Без описания'}
		</div>
		{#if tags.length}
			<div class="flex flex-wrap justify-center gap-2 max-md:gap-1">
				{#each tags as tag}
					<Tag class="bg-main text-text">{tag}</Tag>
				{/each}
			</div>
		{:else}
			<p class="text-sm text-gray-500 max-md:text-xs">Теги не указаны</p>
		{/if}
	</div>
</div>

<style lang="postcss">
	.clear-text :global(*) {
		font-size: inherit !important;
	}
</style>
