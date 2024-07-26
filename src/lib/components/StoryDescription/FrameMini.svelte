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

<div class="flex gap-4">
	<div class={clm('line-clamp-4 max-h-24', !frame.text?.length && 'text-gray-500')}>
		{@html correctVariableReplace(frame.text, variablesStore.variables) || 'Без описания'}
	</div>
	<div class="w-48 shrink-0">
		{#if frame.imageUrl}
			<Image
				alt="Иллюстрация"
				class="h-28 w-full rounded-xl !bg-main/30 text-text"
				cover
				src={frame.imageUrl}
			/>
		{/if}
	</div>
</div>
