<script lang="ts">
	import clsx from 'clsx';

	import type { IVariable } from '$lib/types';

	import { correctVariableReplace } from '$lib/utils';

	export let description: string;
	export let title: string;
	export let vars: Array<IVariable>;
</script>

<div
	class="flex h-[6.25rem] max-w-[12rem] items-center xs:h-32 xs:max-w-[18rem] lg:h-40 lg:max-w-[20rem]
"
>
	<div class="line-clamp-5 w-full text-center">
		<h2 class="mb-1 text-sm/4 uppercase xs:mb-3 xs:text-base/5 lg:mb-4 lg:text-xl/6">
			{title || 'Без названия'}
		</h2>
		<p
			class={clsx(
				'whitespace-pre-wrap',
				description && description.length > 50
					? 'text-xs xs:text-sm lg:text-base'
					: 'text-sm xs:text-base lg:text-xl'
			)}
		>
			{@html correctVariableReplace(description, vars) || 'Без описания'}
		</p>
	</div>
</div>
