<script lang="ts">
	import { BookOpen } from 'svelte-heros-v2';
	import { Icon } from 'treetale-ui';

	import { clm } from '$lib/utils/classMerge';

	import TransparentRect from './TransparentRect.svelte';

	const {
		class: classname
	}: {
		class?: string;
	} = $props();
</script>

<div class={clm('relative', classname)}>
	<div class="bg-main-30 absolute inset-0 flex items-center justify-center rounded-3xl">
		<Icon
			class="text-main-50 absolute h-1/3 w-auto transition-colors"
			variation="solid"
			this={BookOpen}
		/>
	</div>
	<TransparentRect />
</div>
