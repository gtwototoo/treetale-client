<script context="module" lang="ts">
	export interface IList {
		click?: (e: CustomEvent) => void;
		icon?: typeof SvelteComponent<any>;
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

	let className = '';
	export { className as class };

	export let disabled = false;
	export let align: 'left' | 'right' = 'left';
	export let value = '';
	export let size: 'sm' | 'base' | 'lg' | 'xl' = 'base';
	export let placeholder: string;
	export let list: IList[] | string[];

	let focused = false;

	const dispatch = createEventDispatcher();

	const handleClick = () => {
		focused = !focused;
	};

	const handleSelect = (e: CustomEvent, item: IList | string) => {
		if (typeof item === 'string') {
			value = item;
		} else {
			value = item.text;
			if (item.click) {
				item.click(e);
			}
		}

		focused = false;

		dispatch('input', e);
	};
</script>

<div
	class={clsx('listbox', { disabled }, className)}
	use:clickOutside
	on:outclick={() => (focused = false)}
>
	{#if $$slots.default}
		<slot value={value || placeholder} click={handleClick} />
	{:else}
		<Button class="w-full !pr-3 gap-3" {size} on:click={handleClick}>
			<p class={clsx('w-full text-left', !value && 'text-gray-400')}>
				{value || placeholder}
			</p>
			<Icon type={ChevronDown} class={clsx('h-4 w-auto shrink-0', { 'h-3': size === 'sm' })} />
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
					{#if typeof item === 'string'}
						{item}
					{:else}
						{#if item.icon}
							<Icon type={item.icon} />
						{/if}
						<p>{item.text}</p>
					{/if}
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
