<script lang="ts">
	import { autoHeight } from '$lib/hooks';
	import { clsx } from 'clsx';

	let styles: string = '';
	export { styles as class };
	export let coreClass: string = '';
	export let value: string = '';
	export let disabled: boolean = false;
	export let placeholder: string;
	export let maxlength: number | undefined = undefined;

	let textareaElement: HTMLTextAreaElement;
	let focused: boolean = false;
	let blocked = false;

	$: if (!disabled && blocked) {
		// дожидаемся рендера
		setTimeout(() => {
			textareaElement.focus();
		}, 0);
	}
</script>

<div class={clsx(styles, 'textarea', { disabled }, focused ? 'ring-blue-500' : 'ring-gray-200')}>
	<textarea
		style="height:1em"
		bind:this={textareaElement}
		bind:value
		{disabled}
		use:autoHeight
		on:focus={() => (focused = true)}
		on:blur={() => {
			focused = false;

			if (disabled) {
				blocked = true;
			}
		}}
		class={coreClass}
		on:input
		{maxlength}
		{placeholder}
		rows="1"
	/>
</div>

<style lang="postcss">
	textarea {
		@apply flex w-full resize-none overflow-hidden bg-transparent px-4 py-2 text-sm text-black inherit-align placeholder:whitespace-nowrap;
	}
	.textarea {
		@apply leading-0 overflow-hidden rounded-lg bg-white ring-1 transition-[box-shadow] hover:ring-blue-500;
	}
	.disabled {
		@apply pointer-events-none cursor-default bg-gray-100 opacity-40;
	}
</style>
