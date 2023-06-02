<script lang="ts">
	import { clsx } from 'clsx';

	let classes = '';
	export { classes as class };
	export let style = '';
</script>

<div class={clsx('flex flex-col items-center rounded-xl bg-white xs:rounded-2xl', classes)} {style}>
	<slot />
</div>

<style lang="postcss">
	:global(.cardButtons) {
		@apply flex w-full flex-col items-start gap-2 bg-transparent;
	}
</style>
