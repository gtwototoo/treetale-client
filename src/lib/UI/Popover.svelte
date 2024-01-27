<script lang="ts">
	import { fly } from 'svelte/transition';

	import { clsx } from 'clsx';
	import { ChevronDown } from 'svelte-heros-v2';

	import Icon from '$lib/components/Icon.svelte';
	import { clickOutside, correctPosition } from '$lib/hooks';
	import { clm } from '$lib/utils';
	import { Button } from '$UI';

	let className = '';
	export { className as class };

	export let btnClass = '';
	export let disabled = false;
	export let readonly = false;
	export let align: 'inset' | 'left' | 'right' = 'left';
	export let value = '';
	export let placeholder = '';

	let focused = false;

	const handleClick = () => {
		if (readonly) return;

		focused = !focused;
	};
</script>

<div class={clsx('popover', className)} on:outclick={() => (focused = false)} use:clickOutside>
	{#if $$slots.button}
		<slot click={handleClick} {focused} name="button" />
	{:else}
		<Button
			class={clm('w-full bg-contrast-9', btnClass)}
			{disabled}
			on:click={handleClick}
			variant="ghost"
		>
			<p
				class={clsx('min-h-[1.25rem] pr-5', {
					'text-gray-200': !value
				})}
			>
				{value || placeholder}
			</p>
			{#if !readonly}
				<Icon
					class={clsx('absolute right-0 mr-3', focused && 'rotate-180')}
					type={ChevronDown}
				/>
			{/if}
		</Button>
	{/if}
	{#if focused}
		<div
			class={clsx(
				'content',
				{
					inset: '-inset-x-1',
					left: '-left-1',
					right: '-right-1'
				}[align]
			)}
			in:fly={{ y: 10 }}
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
