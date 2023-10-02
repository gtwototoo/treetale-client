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
		vertical
			? 'flex-col divide-y first:childs:!rounded-b-none last:childs:!rounded-t-none'
			: 'divide-x first:childs:!rounded-r-none last:childs:!rounded-l-none'
	)}
>
	<slot />
</div>

<style lang="postcss">
	:global(.form-split > *:not(:first-child):not(:last-child)) {
		@apply !rounded-none;
	}
</style>
