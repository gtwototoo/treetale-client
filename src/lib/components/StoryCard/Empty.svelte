<script lang="ts">
	import { BookOpen } from 'svelte-heros-v2';

	import { clm } from '$lib/utils/classMerge';
	import { Icon } from 'treetale-ui';
	import TransparentRect from './TransparentRect.svelte';

	let {
		class: classname
	}: {
		class?: string;
	} = $props();
</script>

<div class={clm('relative', classname)}>
	<div class="absolute inset-0 flex items-center justify-center rounded-3xl bg-contrast/20">
		<Icon
			class="absolute h-1/3 w-auto bg-transparent text-main transition-colors"
			variation="solid"
			this={BookOpen}
		/>
	</div>
	<TransparentRect />
</div>
