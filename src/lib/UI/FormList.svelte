<script lang="ts">
	import { clsx } from 'clsx';

	let classes: string = '';
	export { classes as class };
</script>

<div class={clsx('form rounded-xl ring-1 ring-gray-200', classes)}>
	<slot />
</div>

<style lang="postcss">
	.form > :global(*) {
		@apply rounded-none ring-0 first:rounded-t-xl last:rounded-b-xl;
	}
</style>
