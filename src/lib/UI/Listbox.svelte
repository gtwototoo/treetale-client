<script context="module" lang="ts">
	export interface IList {
		click?: (e: CustomEvent) => void;
		icon?: typeof SvelteComponent<unknown>;
		title: string;
	}
</script>

<script lang="ts">
	import { type SvelteComponent, createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	import { clsx } from 'clsx';
	import { ChevronDown } from 'svelte-heros-v2';

	import { Button, FormSplit } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { clickOutside, correctPosition } from '$lib/hooks';
	import { clm } from '$lib/utils';

	let className = '';
	export { className as class };

	export let disabled = false;
	export let readonly = false;
	export let align: 'center' | 'inset' | 'left' | 'right' = 'left';
	export let value = '';
	export let size: 'base' | 'lg' | 'sm' | 'xl' = 'base';
	export let placeholder: string;
	export let list: Array<IList | string>;

	let focused = false;

	const dispatch = createEventDispatcher<{
		change: string;
	}>();

	const handleClick = () => {
		if (readonly || !list.length) return;

		focused = !focused;
	};

	const handleSelect = (e: CustomEvent, item: IList | string) => {
		if (typeof item === 'string') {
			value = item;
		} else {
			value = item.title;
			if (item.click) {
				item.click(e);
			}
		}

		focused = false;

		dispatch('change', value);
	};
</script>

<div class={clsx('listbox', className)} on:outclick={() => (focused = false)} use:clickOutside>
	{#if $$slots.default}
		<slot click={handleClick} value={value || placeholder} />
	{:else}
		<Button
			class={clm('w-full gap-3 bg-contrast-9 !pr-3', size === 'sm' && 'gap-1 !pr-2')}
			{disabled}
			on:click={handleClick}
			{size}
			variant="ghost"
		>
			<p class={clm('w-full text-left', !value && 'text-gray-400')}>
				{value || placeholder}
			</p>
			{#if !readonly}
				<Icon
					class={clm('h-5 w-auto shrink-0', size === 'sm' && 'h-4', focused && 'rotate-180')}
					type={ChevronDown}
				/>
			{/if}
		</Button>
	{/if}
	{#if focused}
		<div
			class={clm(
				'list',
				{
					center: '-left-1/2',
					inset: '-inset-x-1',
					left: '-left-1',
					right: '-right-1'
				}[align]
			)}
			in:fly={{ y: 10 }}
			use:correctPosition
		>
			<FormSplit vertical>
				{#each list as item}
					<Button
						class="w-full gap-4 bg-contrast-9 text-text"
						on:click={(e) => handleSelect(e, item)}
						variant="ghost"
					>
						{#if typeof item === 'string'}
							{item}
						{:else}
							{#if item.icon}
								<Icon type={item.icon} />
							{/if}
							<p>{item.title}</p>
						{/if}
					</Button>
				{/each}
			</FormSplit>
		</div>
	{/if}
</div>

<style lang="postcss">
	.listbox {
		@apply relative bg-transparent text-text;
	}
	.list {
		@apply absolute z-20 flex flex-col gap-1 rounded-lg bg-contrast p-1 shadow-md;
	}
</style>
