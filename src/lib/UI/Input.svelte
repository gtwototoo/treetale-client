<script lang="ts">
	import { clm } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

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

	const dispatch = createEventDispatcher();

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

	let focused = false;

	const onlyNumbers = (enable: boolean) => {
		if (!enable) return;

		value = value.replace(/[^\d]/g, '');

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
		on:input={handleInput}
		on:change
	/>
	<slot />
</button>

<style lang="postcss">
	input {
		@apply w-full bg-transparent inherit-align placeholder:select-none;
	}
	.size-sm {
		@apply rounded px-2 py-1 text-xs;
	}
	.size-base {
		@apply min-h-[2.5rem] rounded-lg px-4 py-2 text-sm;
	}
	.size-lg {
		@apply rounded-xl px-6 py-3 text-base font-medium;
	}
	.input {
		@apply relative flex cursor-text items-center bg-main-20 text-left text-text transition-colors hover:bg-main-30;
	}
	.disabled {
		@apply pointer-events-none cursor-default opacity-40;
	}
</style>
