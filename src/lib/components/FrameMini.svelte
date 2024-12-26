<script lang="ts">
	import { Image } from 'treetale-ui';

	import { variablesStore } from '$lib/stores/variables.svelte';
	import type { Frame } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';
	import { correctVariableReplace } from '$lib/utils/text';

	const {
		frame,
		short = true
	}: {
		frame: Frame;
		short?: boolean;
	} = $props();
</script>

<div class="flex w-full flex-col gap-4 border-l-2 border-main px-2">
	{#if frame.imageUrl}
		<Image
			alt="Иллюстрация"
			class="h-48 w-full rounded-xl bg-main-40 text-text"
			cover
			src={frame.imageUrl}
		/>
	{/if}
	<div
		class={clm(
			'adaptive-font clear-text',
			short && 'line-clamp-4',
			!frame.text?.length && 'text-gray-500'
		)}
	>
		{@html correctVariableReplace(frame.text, variablesStore.variables) || 'Без описания'}
	</div>
</div>
