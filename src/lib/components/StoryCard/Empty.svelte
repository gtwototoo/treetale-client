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
	<div class="absolute inset-0 flex items-center justify-center rounded-3xl bg-main-30">
		<Icon
			class="absolute h-1/3 w-auto text-main-50 transition-colors"
			variation="solid"
			this={BookOpen}
		/>
	</div>
	<TransparentRect />
</div>
