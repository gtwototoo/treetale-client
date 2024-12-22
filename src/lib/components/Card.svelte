<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { clm } from '$lib/utils/classMerge';

	const { children, class: classname, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={clm('flex flex-col rounded-xl xs:rounded-2xl', classname)} {...props}>
	{@render children?.()}
</div>
