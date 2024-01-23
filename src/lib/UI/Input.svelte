<script lang="ts">
	import { clm } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	export let value = '';
	export let number = false;
	export let size: 'sm' | 'base' | 'lg' = 'base';
	export let disabled = false;
	export let required = false;
	export let readonly = false;
	export let maxlength: number | undefined = undefined;
	export let placeholder: string;
	export let name: string | undefined = undefined;

	let focused = false;
	let inputRef: HTMLInputElement;

	let className = '';
	export { className as class };

	const dispatch = createEventDispatcher<{
		input: Event & { currentTarget: EventTarget & HTMLInputElement };
	}>();

	const handleFocus = () => {
		focused = true;
	};

	const handleBlur = () => {
		focused = false;
	};

	const handleInput = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		onlyNumbers(number);

		dispatch('input', e);
	};

	const handleClick = () => {
		inputRef.focus();
	};

	const onlyNumbers = (enable: boolean) => {
		if (!enable) return;

		value = value.replace(/[^\d-]|(?!^)[-]+/g, '');

		if (value.length !== 1 && value[0] === '0') {
			value = value.substring(1);
		}
	};

	$: onlyNumbers(number);
</script>

<button
	type="button"
	class={clm(
		'input',
		`size-${size}`,
		required && !value && '!bg-red-100',
		focused && '!bg-contrast-5',
		$$slots.left &&
			{
				sm: '!pl-1',
				base: '!pl-2',
				lg: '!pl-3'
			}[size],
		$$slots.right &&
			{
				sm: '!pr-1',
				base: '!pr-2',
				lg: '!pr-3'
			}[size],
		{ disabled },
		className
	)}
	on:click={handleClick}
>
	<slot name="left" />
	<input
		bind:this={inputRef}
		{readonly}
		{name}
		{disabled}
		{maxlength}
		{placeholder}
		bind:value
		on:focus={handleFocus}
		on:blur={handleBlur}
		on:input={handleInput}
		on:change
	/>
	<slot name="right" />
</button>

<style lang="postcss">
	input {
		@apply w-full bg-transparent inherit-align placeholder:select-none;
	}
	.size-sm {
		@apply gap-1 rounded px-2 py-1 text-xs;
	}
	.size-base {
		@apply min-h-[2.5rem] gap-2 rounded-lg px-4 py-2 text-sm;
	}
	.size-lg {
		@apply gap-3 rounded-xl px-6 py-3 text-base font-medium;
	}
	.input {
		@apply bg-contrast-2 hover:bg-contrast-5 relative flex cursor-text items-center text-left text-text transition-colors;
	}
	.disabled {
		@apply pointer-events-none cursor-default opacity-40;
	}
</style>
