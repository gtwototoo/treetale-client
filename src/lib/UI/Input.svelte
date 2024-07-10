<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { clm } from '$lib/utils';

	export let value = '';
	export let number = false;
	export let size: 'base' | 'lg' | 'sm' = 'base';
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
		click: MouseEvent;
		input: { currentTarget: EventTarget & HTMLInputElement } & Event;
	}>();

	const handleFocus = () => {
		focused = true;
	};

	const handleBlur = () => {
		focused = false;
	};

	const handleInput = (e: { currentTarget: EventTarget & HTMLInputElement } & Event) => {
		onlyNumbers(number);

		dispatch('input', e);
	};

	const handleClick = (e: MouseEvent) => {
		inputRef.focus();

		dispatch('click', e);
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
	class={clm(
		'input',
		`size-${size}`,
		required && !value && '!bg-red-100',
		focused && '!bg-contrast-5',
		$$slots.left &&
			{
				base: '!pl-2',
				lg: '!pl-3',
				sm: '!pl-1'
			}[size],
		$$slots.right &&
			{
				base: '!pr-2',
				lg: '!pr-3',
				sm: '!pr-1'
			}[size],
		{ disabled },
		className
	)}
	on:click={handleClick}
	type="button"
>
	<slot name="left" />
	<input
		bind:this={inputRef}
		bind:value
		{disabled}
		{maxlength}
		{name}
		on:blur={handleBlur}
		on:change
		on:focus={handleFocus}
		on:input={handleInput}
		{placeholder}
		{readonly}
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
		@apply relative flex cursor-text items-center bg-contrast-2 text-left text-text transition-colors hover:bg-contrast-5;
	}
	.disabled {
		@apply pointer-events-none cursor-default opacity-40;
	}
</style>
