<script>
	import { clsx } from 'clsx';

	let classes = '';
	export { classes as class };
</script>

<div
	class={clsx(
		'selector childs:bg-transparent first:childs:!rounded-l-lg last:childs:!rounded-r-lg childelem-[button]:!rounded-none flex',
		classes
	)}
>
	<slot />
</div>

<style lang="postcss">
	.selector {
		@apply flex rounded-lg bg-white text-black ring-1 ring-gray-200;
	}
</style>
