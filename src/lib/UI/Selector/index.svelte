<script>
	import { clsx } from 'clsx';

	let className = '';
	export { className as class };
</script>

<div
	class={clsx(
		'selector flex *:bg-transparent first:*:!rounded-l-lg last:*:!rounded-r-lg',
		className
	)}
>
	<slot />
</div>

<style lang="postcss">
	.selector {
		@apply flex rounded-lg bg-white text-black;
	}
</style>
