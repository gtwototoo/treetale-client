<script lang="ts">
	import type { IVariable } from '$lib/types';

	import { correctVariableReplace } from '$lib/utils';

	export let tags: Array<string>;
	export let description: string;
	export let vars: IVariable[];
</script>

<div
	class="absolute bottom-0 flex max-h-full w-full translate-y-full flex-col gap-3 overflow-auto rounded-inherit bg-contrast p-4 text-center transition-transform group-hover:translate-y-0"
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
