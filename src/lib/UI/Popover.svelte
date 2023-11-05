<script lang="ts">
	import { clsx } from 'clsx';
	import { fly } from 'svelte/transition';
	import { ChevronDown } from 'svelte-heros-v2';

	import Icon from '$lib/components/Icon.svelte';
	import { clickOutside, correctPosition } from '$lib/hooks';
	import { Button } from '$UI';


	let className = '';
	export { className as class };

	export let disabled = false;
	export let align: 'left' | 'right' = 'left';
	export let value = '';
	export let placeholder = '';

	let focused = false;

	const handleClick = () => {
		focused = !focused;
	};
</script>

<div class={clsx('popover', className)} use:clickOutside on:outclick={() => (focused = false)}>
	{#if $$slots.button}
		<slot name="button" {focused} click={handleClick} />
	{:else}
		<Button class="w-full" {disabled} on:click={handleClick}>
			<p
				class={clsx('min-h-[1.25rem] pr-5', {
					'text-gray-200': !value
				})}
			>
				{value || placeholder}
			</p>
			<Icon type={ChevronDown} class={clsx('absolute right-0 mx-2', focused && 'rotate-180')} />
		</Button>
	{/if}
	{#if focused}
		<div in:fly={{ y: 10 }} class={clsx('content', `${align}-0`)} use:correctPosition>
			<slot />
		</div>
	{/if}
</div>

<style lang="postcss">
	.content {
		@apply absolute z-[4] rounded-lg bg-white text-black shadow;
	}
	.popover {
		@apply relative bg-transparent;
	}
</style>
