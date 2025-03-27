<script lang="ts">
	import type { ComponentProps, Snippet } from 'svelte';

	import { Popover } from 'melt/builders';

	import Button from './Button.svelte';
	import type { Placement } from './types';

	const {
		placement,
		children,
		button,
		...other
	}: {
		placement?: Placement;
		children: Snippet;
		button: Snippet;
	} & ComponentProps<typeof Button> = $props();

	const popover = new Popover({
		floatingConfig: {
			computePosition: {
				placement
			}
		}
	});
</script>

<Button {...popover.trigger} {...other}>
	{@render button?.()}
</Button>
<div class="bg-contrast text-text rounded-xl shadow-md" {...popover.content}>
	{@render children?.()}
</div>
