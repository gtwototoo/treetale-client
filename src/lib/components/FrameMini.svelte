<script lang="ts">
	import { variablesStore } from '$lib/stores/variables.svelte';
	import type { Frame } from '$lib/types';
	import Image from '$lib/ui/Image.svelte';
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

<div class="border-main flex w-full flex-col gap-4 border-l-2 px-2">
	{#if frame.imageUrl}
		<Image
			alt="Иллюстрация"
			class="bg-main-400 text-text h-48 w-full rounded-xl"
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
