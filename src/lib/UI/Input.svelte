<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { enableControl, onlyDigits } from '$lib/hooks';
	import { clm } from '$lib/utils';
	import { clsx } from 'clsx';
	import type { SvelteComponent } from 'svelte';

	let classes: string = '';
	export { classes as class };
	export let coreClass: string = '';
	export let value: string = '';
	export let number: boolean = false;
	export let size: 'sm' | 'base' | 'lg' = 'base';
	export let disabled: boolean = false;
	export let icon: typeof SvelteComponent | undefined = undefined;
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

	let focused = false;
</script>

<div
	class={clm(
		'input',
		{ disabled, '!bg-red-100': required && !value, '!bg-blue-50': focused },
		`size-${size}`,
		classes
	)}
>
	{#if icon}
		<Icon type={icon} class="absolute mx-4" />
	{/if}
	<input
		class={clsx(coreClass, { '!pl-[3.25rem]': icon })}
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
</div>

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
		@apply relative flex items-center bg-white transition-colors hover:bg-blue-50;
	}
	.disabled {
		@apply pointer-events-none cursor-default bg-gray-100 opacity-40;
	}
</style>
