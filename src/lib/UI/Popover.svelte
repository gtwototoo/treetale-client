<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { clickOutside, correctPosition } from '$lib/hooks';
	import { Button } from '$UI';
	import { clsx } from 'clsx';
	import { ChevronDown } from 'svelte-heros-v2';
	import { fly } from 'svelte/transition';

	let classes: string = '';
	export { classes as class };
	export let disabled: boolean = false;
	export let align: 'left' | 'right' = 'left';
	export let value: string = '';
	export let placeholder: string = '';

	let focused: boolean = false;

	const handleClick = () => {
		focused = !focused;
	};
</script>

<div
	class={clsx('popover', { disabled }, classes)}
	use:clickOutside
	on:outclick={() => (focused = false)}
>
	{#if $$slots.button}
		<button class="flex h-full childs:h-full" on:click={handleClick}>
			<slot name="button" {focused} />
		</button>
	{:else}
		<Button class="w-full" on:click={handleClick}>
			<p
				class={clsx('min-h-[1.25rem] pr-5', {
					'text-gray-200': !value
				})}
			>
				{value || placeholder}
			</p>
			<Icon type={ChevronDown} class="absolute right-0 mx-2" />
		</Button>
	{/if}
	{#if focused}
		<div in:fly|local={{ y: 10 }} class={clsx('content', `${align}-0`)} use:correctPosition>
			<slot />
		</div>
	{/if}
</div>

<style lang="postcss">
	.content {
		@apply absolute z-[4] rounded-lg bg-white text-black shadow-md;
	}
	.popover {
		@apply relative;
	}
</style>
