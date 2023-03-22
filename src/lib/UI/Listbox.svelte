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

	let classes: string = '';
	export { classes as class };
	export let disabled: boolean = false;
	export let align: 'left' | 'right' = 'left';
	export let value: string = '';
	export let placeholder: string;
	export let list: IList[];

	let focused: boolean = false;

	const dispatch = createEventDispatcher();

	const handleClick = () => {
		focused = !focused;
	};
</script>

<div
	class={clsx('listbox', { disabled }, classes)}
	use:clickOutside
	on:outclick={() => (focused = false)}
>
	{#if $$slots.default}
		<button on:click={handleClick}>
			<slot />
		</button>
	{:else}
		<Button class="w-full" on:click={handleClick}>
			<p class={clsx('pr-5', { 'text-gray-200': !value })}>
				{value || placeholder}
			</p>
			<Icon type={ChevronDown} class="absolute right-0 mx-2" />
		</Button>
	{/if}
	{#if focused}
		<div in:fly|local={{ y: 10 }} class={clsx('list', `${align}-0`)} use:correctPosition>
			{#each list as { click, icon, text }}
				<Button
					on:click={(e) => {
						value = text;
						if (click) {
							click(e);
						}
						dispatch('input', e);
						focused = false;
					}}
					class="w-full gap-4 !bg-transparent"
					variant="secondary"
				>
					{#if icon}
						<Icon type={icon} />
					{/if}
					<p>{text}</p>
				</Button>
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	.listbox {
		@apply relative;
	}
	.list {
		@apply absolute z-[4] rounded-lg bg-white p-2 text-black shadow-md;
	}
</style>
