<script lang="ts">
	import { Image } from 'treetale-ui';

	import type { Frame } from '$lib/types';

	import { variablesStore } from '$lib/stores/variables.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { correctVariableReplace } from '$lib/utils/text';

	let {
		frame
	}: {
		frame: Frame;
	} = $props();
</script>

<div class="flex flex-col gap-4">
	{#if frame.imageUrl}
		<Image
			alt="Иллюстрация"
			class="h-48 w-full rounded-xl !bg-main/30 text-text"
			cover
			src={frame.imageUrl}
		/>
	{/if}
	<div class={clm('line-clamp-4 max-h-24 px-2', !frame.text?.length && 'text-gray-500')}>
		{@html correctVariableReplace(frame.text, variablesStore.variables) || 'Без описания'}
	</div>
</div>
