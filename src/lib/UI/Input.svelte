<script lang="ts">
	import { enableControl, onlyDigits } from '$lib/hooks';
	import { clm } from '$lib/utils';

	let inputRef: HTMLInputElement;

	let className = '';
	export { className as class };

	export let value = '';
	export let number = false;
	export let size: 'sm' | 'base' | 'lg' = 'base';
	export let disabled = false;
	export let required = false;
	export let maxlength: number | undefined = undefined;
	export let placeholder: string;
	export let name: string | undefined = undefined;

	const handleFocus = () => {
		focused = true;
	};

	const handleBlur = () => {
		focused = false;
	};

	const handleClick = () => {
		inputRef.focus();
	};

	let focused = false;
</script>

<button
	class={clm(
		'input',
		`size-${size}`,
		required && !value && '!bg-red-100',
		focused && '!bg-main-30',
		{ disabled },
		className
	)}
	on:click={handleClick}
>
	<slot name="left" />
	<input
		bind:this={inputRef}
		{name}
		{disabled}
		{maxlength}
		{placeholder}
		bind:value
		on:focus={handleFocus}
		on:blur={handleBlur}
		on:input
		on:change
		use:enableControl={{ f: onlyDigits, enabled: number }}
	/>
	<slot />
</button>

<style lang="postcss">
	input {
		@apply w-full bg-transparent text-black inherit-align placeholder:select-none;
	}
	.size-sm {
		@apply rounded px-2 py-1 text-xs;
	}
	.size-base {
		@apply rounded-lg px-4 py-2 text-sm;
	}
	.size-lg {
		@apply rounded-xl px-6 py-3 text-base font-medium;
	}
	.input {
		@apply relative flex cursor-text items-center bg-white text-left transition-colors hover:bg-main-30;
	}
	.disabled {
		@apply pointer-events-none cursor-default bg-gray-100 opacity-40;
	}
</style>
