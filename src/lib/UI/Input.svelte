<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { enableControl, onlyDigits } from '$lib/hooks';
	import { clsx } from 'clsx';
	import type { SvelteComponent } from 'svelte';

	let classes: string = '';
	export { classes as class };
	export let coreClass: string = '';
	export let value: string = '';
	export let number: boolean = false;
	export let size: 'small' | 'default' | 'big' = 'default';
	export let disabled: boolean = false;
	export let icon: typeof SvelteComponent | undefined = undefined;
	export let required = false;

	const handleFocus = () => {
		focused = true;
	};

	const handleBlur = () => {
		focused = false;
	};

	let focused = false;
</script>

<div
	class={clsx(
		'input',
		{ disabled },
		required && !value ? 'ring-red-500' : focused ? 'ring-blue-500' : 'ring-gray-200',
		classes
	)}
>
	{#if icon}
		<Icon type={icon} class="absolute mx-4" />
	{/if}
	<input
		{...$$props}
		class={clsx(coreClass, { '!pl-[3.25rem]': icon }, size)}
		bind:value
		on:focus={handleFocus}
		on:blur={handleBlur}
		on:input
		on:change
		use:enableControl={{ f: onlyDigits, enabled: number }}
	/>
</div>

<style lang="postcss">
	input {
		@apply w-full bg-transparent text-black inherit-align placeholder:select-none;
	}
	.big {
		@apply px-8 py-4 text-base;
	}
	.default {
		@apply px-4 py-2 text-sm;
	}
	.small {
		@apply p-2 text-sm;
	}
	.input {
		@apply relative flex items-center overflow-hidden rounded-lg bg-white ring-1 transition-[box-shadow] hover:ring-blue-500;
	}
	.disabled {
		@apply pointer-events-none cursor-default bg-gray-100 opacity-40;
	}
</style>
