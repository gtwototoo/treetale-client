<script lang="ts">
	import { clm } from '$lib/utils/classMerge';
	import type { HTMLAttributes } from 'svelte/elements';

	let { class: classname, children, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={clm('flex flex-col rounded-xl xs:rounded-2xl', classname)} {...props}>
	{@render children?.()}
</div>
