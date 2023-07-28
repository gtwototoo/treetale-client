<script context="module" lang="ts">
	export interface IList {
		click?: (e: CustomEvent) => void;
		icon?: typeof SvelteComponent;
		text: string;
	}
</script>

<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';

	import { clickOutside, correctPosition } from '$lib/hooks';
	import { Button } from '$UI';
	import { clsx } from 'clsx';
	import { createEventDispatcher, type SvelteComponent } from 'svelte';
	import { ChevronDown } from 'svelte-heros-v2';
	import { fly } from 'svelte/transition';

	let classes = '';
	export { classes as class };
	export let disabled = false;
	export let align: 'left' | 'right' = 'left';
	export let value = '';
	export let size: 'sm' | 'base' | 'lg' | 'xl' = 'base';
	export let placeholder: string;
	export let list: IList[];

	let focused = false;

	const dispatch = createEventDispatcher();

	const handleClick = () => {
		focused = !focused;
	};

	const handleSelect = (e: CustomEvent, item: IList) => {
		value = item.text;
		if (item.click) {
			item.click(e);
		}
		dispatch('input', e);
		focused = false;
	};
</script>

<div
	class={clsx('listbox', { disabled }, classes)}
	use:clickOutside
	on:outclick={() => (focused = false)}
>
	{#if $$slots.default}
		<slot value={value || placeholder} click={handleClick} />
	{:else}
		<Button class="w-full" {size} on:click={handleClick}>
			<p class={clsx('pr-5', { 'text-gray-200': !value })}>
				{value || placeholder}
			</p>
			<Icon
				type={ChevronDown}
				class={clsx('absolute right-0 mx-2', { 'h-3 w-auto': size === 'sm' })}
			/>
		</Button>
	{/if}
	{#if focused}
		<div in:fly={{ y: 10 }} class={clsx('list', `${align}-0`)} use:correctPosition>
			{#each list as item}
				<Button
					on:click={(e) => handleSelect(e, item)}
					class="w-full gap-4 !bg-transparent"
					variant="secondary"
				>
					{#if item.icon}
						<Icon type={item.icon} />
					{/if}
					<p>{item.text}</p>
				</Button>
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	.listbox {
		@apply relative bg-transparent;
	}
	.list {
		@apply absolute z-[4] rounded-lg bg-white text-black shadow-md;
	}
</style>
