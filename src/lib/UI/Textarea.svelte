<script lang="ts">
	import { autoHeight } from '$lib/hooks';
	import { clsx } from 'clsx';

	let classes: string = '';
	let focused: boolean = false;

	const handleFocus = () => {
		focused = true;
	};

	const handleBlur = () => {
		focused = false;
	};

	export { classes as class };
	export let value: string = '';
	export let disabled: boolean = false;
</script>

<div class={clsx(classes, 'textarea', { disabled }, focused ? 'ring-blue-500' : 'ring-gray-200')}>
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
		@apply overflow-hidden rounded-lg bg-white leading-0 ring-1 transition-[box-shadow] hover:ring-blue-500;
	}
	.disabled {
		@apply pointer-events-none cursor-default bg-gray-100 opacity-40;
	}
</style>
