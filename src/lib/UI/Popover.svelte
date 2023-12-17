<script lang="ts">
	import { clsx } from 'clsx';
	import { ChevronDown } from 'svelte-heros-v2';
	import { fly } from 'svelte/transition';

	import Icon from '$lib/components/Icon.svelte';
	import { clickOutside, correctPosition } from '$lib/hooks';
	import { Button } from '$UI';

	let className = '';
	export { className as class };

	export let disabled = false;
	export let readonly = false;
	export let align: 'left' | 'right' | 'inset' = 'left';
	export let value = '';
	export let placeholder = '';

	let focused = false;

	const handleClick = () => {
		if (readonly) return;

		focused = !focused;
	};
</script>

<div class={clsx('popover', className)} use:clickOutside on:outclick={() => (focused = false)}>
	{#if $$slots.button}
		<slot name="button" {focused} click={handleClick} />
	{:else}
		<Button variant="ghost" class="w-full bg-main" {disabled} on:click={handleClick}>
			<p
				class={clsx('min-h-[1.25rem] pr-5', {
					'text-gray-200': !value
				})}
			>
				{value || placeholder}
			</p>
			{#if !readonly}
				<Icon
					type={ChevronDown}
					class={clsx('absolute right-0 mr-3', focused && 'rotate-180')}
				/>
			{/if}
		</Button>
	{/if}
	{#if focused}
		<div
			in:fly={{ y: 10 }}
			class={clsx(
				'content',
				{
					left: '-left-1',
					right: '-right-1',
					inset: '-inset-x-1'
				}[align]
			)}
			use:correctPosition
		>
			<slot />
		</div>
	{/if}
</div>

<style lang="postcss">
	.content {
		@apply absolute z-[4] rounded-lg bg-contrast text-text shadow;
	}
	.popover {
		@apply relative bg-transparent;
	}
</style>
