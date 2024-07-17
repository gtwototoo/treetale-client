<script lang="ts">
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

<div
	class="max-size-full absolute bottom-0 flex w-full translate-y-full flex-col gap-3 overflow-auto rounded-inherit bg-contrast p-4 text-center transition-transform group-hover:translate-y-0"
>
	<p class="clear-text text-base text-text max-md:text-sm">
		{@html correctVariableReplace(description, vars) || 'Без описания'}
	</p>
	<p class="select-none text-sm text-gray-500 max-md:text-xs">
		{tags.length ? tags.join(' - ') : 'Теги не указаны'}
	</p>
</div>

<style lang="postcss">
	.clear-text :global(*) {
		font-size: inherit !important;
	}
</style>
