<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	const { children, ...props }: HTMLAnchorAttributes = $props();
</script>

<a draggable="false" {...props}>
	{@render children?.()}
</a>
