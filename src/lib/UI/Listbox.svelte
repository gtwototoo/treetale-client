<script context="module" lang="ts">
	export interface IList {
		click?: (e: CustomEvent) => void;
		icon?: typeof SvelteComponent<unknown>;
		text: string;
	}
</script>

<script lang="ts">
	import { clsx } from 'clsx';
	import { createEventDispatcher, type SvelteComponent } from 'svelte';
	import { ChevronDown } from 'svelte-heros-v2';
	import { fly } from 'svelte/transition';

	import Icon from '$lib/components/Icon.svelte';
	import { clickOutside, correctPosition } from '$lib/hooks';
	import { Button } from '$UI';
	import FormSplit from './FormSplit.svelte';

	let className = '';
	export { className as class };

	export let disabled = false;
	export let readonly = false;
	export let align: 'left' | 'right' = 'left';
	export let value = '';
	export let size: 'sm' | 'base' | 'lg' | 'xl' = 'base';
	export let placeholder: string;
	export let list: Array<IList | string>;

	let focused = false;

	const dispatch = createEventDispatcher();

	const handleClick = () => {
		if (readonly) return;

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

		dispatch('change', e);
	};
</script>

<div class={clsx('listbox', className)} use:clickOutside on:outclick={() => (focused = false)}>
	{#if $$slots.default}
		<slot value={value || placeholder} click={handleClick} />
	{:else}
		<Button
			variant="ghost"
			class="w-full gap-3 bg-main !pr-3"
			{disabled}
			{size}
			on:click={handleClick}
		>
			<p class={clsx('w-full text-left', !value && 'text-gray-400')}>
				{value || placeholder}
			</p>
			{#if !readonly}
				<Icon
					type={ChevronDown}
					class={clsx('h-4 w-auto shrink-0', { 'h-3': size === 'sm' })}
				/>
			{/if}
		</Button>
	{/if}
	{#if focused}
		<div
			in:fly={{ y: 10 }}
			class={clsx('list', align === 'left' ? '-left-1' : '-right-1')}
			use:correctPosition
		>
			<FormSplit class="divide-contrast" vertical>
				{#each list as item}
					<Button
						on:click={(e) => handleSelect(e, item)}
						class="w-full gap-4 bg-main text-text"
						variant="ghost"
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
			</FormSplit>
		</div>
	{/if}
</div>

<style lang="postcss">
	.listbox {
		@apply relative bg-transparent;
	}
	.list {
		@apply absolute z-[4] flex flex-col gap-1 rounded-lg bg-contrast p-1 shadow-md;
	}
</style>
