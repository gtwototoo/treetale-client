<script lang="ts">
	import { BookOpen } from 'svelte-heros-v2';

	import Icon from '$lib/ui/Icon.svelte';
	import { clm } from '$lib/utils/classMerge';

	import TransparentRect from './TransparentRect.svelte';

	const {
		class: classname
	}: {
		class?: string;
	} = $props();
</script>

<div class={clm('relative', classname)}>
	<div class="bg-main-200 absolute inset-0 flex items-center justify-center rounded-3xl">
		<Icon
			class="text-contrast absolute h-1/3 w-auto transition-colors"
			variation="solid"
			this={BookOpen}
		/>
	</div>
	<TransparentRect />
</div>
