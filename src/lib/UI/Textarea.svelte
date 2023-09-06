<script lang="ts">
	import { autoHeight } from '$lib/hooks';
	import { clm } from '$lib/utils';

	let className = '';
	export { className as class };
	export let value = '';
	export let disabled = false;

	let focused = false;

	const handleFocus = () => {
		focused = true;
	};

	const handleBlur = () => {
		focused = false;
	};
</script>

<div class={clm('textarea', { disabled, '!bg-blue-50': focused }, className)}>
	<textarea
		bind:value
		{disabled}
		use:autoHeight
		on:focus={handleFocus}
		on:blur={handleBlur}
		on:input
		{...$$props}
		rows="1"
	/>
</div>

<style lang="postcss">
	textarea {
		@apply flex w-full resize-none overflow-hidden break-all bg-transparent px-4 py-2 text-sm text-black inherit-align placeholder:whitespace-nowrap;
	}
	.textarea {
		@apply overflow-hidden rounded-lg bg-white leading-0 transition-colors hover:bg-blue-50;
	}
	.disabled {
		@apply pointer-events-none cursor-default bg-gray-100 opacity-40;
	}
</style>
