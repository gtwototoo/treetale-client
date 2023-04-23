<script>
	import { clsx } from 'clsx';

	let classes = '';
	export { classes as class };
</script>

<div
	class={clsx(
		'selector flex childs:bg-transparent first:childs:!rounded-l-lg last:childs:!rounded-r-lg child-[button]:!rounded-none',
		classes
	)}
>
	<slot />
</div>

<style lang="postcss">
	.selector {
		@apply flex rounded-lg bg-white text-black;
	}
</style>
