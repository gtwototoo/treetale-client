<script lang="ts">
	import { clsx } from 'clsx';

	let className = '';
	export { className as class };

	export let vertical = false;
</script>

<div
	class={clsx(
		className,
		'flex divide-gray-100 form-split',
		vertical ? 'flex-col divide-y vertical' : 'divide-x horizontal'
	)}
>
	<slot />
</div>

<style lang="postcss">
	.form-split.vertical > :global(:first-child:not(:only-child)) {
		@apply !rounded-b-none;
	}
	.form-split.vertical > :global(:last-child:not(:only-child)) {
		@apply !rounded-t-none;
	}
	.form-split.horizontal > :global(:first-child:not(:only-child)) {
		@apply !rounded-r-none;
	}
	.form-split.horizontal > :global(:last-child:not(:only-child)) {
		@apply !rounded-l-none;
	}
	.form-split > :global(:not(:first-child):not(:last-child)) {
		@apply !rounded-none;
	}
</style>
