<script lang="ts">
	import type { Snippet } from 'svelte';

	import { clm } from '$lib/utils/classMerge';

	const {
		class: classname,
		vertical = false,
		children
	}: {
		class?: string;
		vertical?: boolean;
		children: Snippet;
	} = $props();
</script>

<div
	class={clm('form-split flex gap-px', vertical ? 'vertical flex-col' : 'horizontal', classname)}
>
	{@render children()}
</div>

<style lang="postcss">
	.form-split {
		& > :global(:not(:first-child):not(:last-child)) {
			@apply !rounded-none;
		}
		&.horizontal {
			& > :global(:first-child:not(:only-child)) {
				@apply !rounded-r-none;
			}
			& > :global(:last-child:not(:only-child)) {
				@apply !rounded-l-none;
			}
		}
		&.vertical {
			& > :global(:first-child:not(:only-child)) {
				@apply !rounded-b-none;
			}
			& > :global(:last-child:not(:only-child)) {
				@apply !rounded-t-none;
			}
		}
	}
</style>
