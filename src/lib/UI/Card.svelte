<script lang="ts">
	import { clsx } from 'clsx';

	let classes: string = '';
	export { classes as class };
	export let style = '';
</script>

<div class={clsx('card', classes)} {style}>
	<slot />
</div>

<style lang="postcss">
	.card {
		@apply xs:rounded-2xl flex flex-col items-center rounded-xl bg-white;
	}
	:global(.cardButtons) {
		@apply flex w-full flex-col items-start gap-2 bg-transparent;
	}
</style>
