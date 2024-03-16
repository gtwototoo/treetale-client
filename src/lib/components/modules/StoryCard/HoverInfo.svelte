<script lang="ts">
	import type { IVariable } from '$lib/types';

	import { correctVariableReplace } from '$lib/utils';

	export let tags: Array<string>;
	export let description: string;
	export let vars: IVariable[];
</script>

<div
	class="absolute bottom-0 flex max-h-full w-full translate-y-full flex-col gap-3 overflow-auto rounded-inherit bg-contrast p-4 text-center text-base text-text transition-transform group-hover:translate-y-0"
>
	<p>{@html correctVariableReplace(description, vars) || 'Без описания'}</p>
	<div class="w-full select-none text-center text-sm text-gray-500">
		{tags.length ? tags.join(' - ') : 'Теги не указаны'}
	</div>
</div>
