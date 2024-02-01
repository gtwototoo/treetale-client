<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Icon from '$lib/components/Icon.svelte';
	import { Loading } from '$lib/components/icons';
	import { clickHold } from '$lib/hooks';
	import { clm } from '$lib/utils';

	const dispatch = createEventDispatcher<{
		click: MouseEvent;
		holdclick: MouseEvent;
	}>();

	let className = '';
	export { className as class };

	export let variant: 'custom' | 'ghost' | 'main';
	export let size: 'base' | 'lg' | 'sm' | 'xl' = 'base';
	export let disabled = false;
	export let loading = false;
	export let element: HTMLButtonElement | undefined = undefined;
	export let value: string | undefined = undefined;
	export let style = '';
	export let type: 'button' | 'reset' | 'submit' | undefined = 'button';

	const handleClick = (e: MouseEvent) => {
		if (disabled) return;

		dispatch('click', e);
	};

	const handleHoldClick = (e: MouseEvent) => {
		if (disabled) return;

		dispatch('holdclick', e);
	};
</script>

<button
	bind:this={element}
	class={clm(
		'transition-opacity *:bg-transparent',
		`size-${size}`,
		loading && '!text-transparent *:invisible',
		variant !== 'custom' && `variant-${variant}`,
		(disabled || loading) && 'disabled',
		className
	)}
	on:click={handleClick}
	on:dragenter
	on:dragleave
	on:drop
	on:holdclick={handleHoldClick}
	on:mousedown
	use:clickHold
	{...{ style, type, value }}
>
	<slot />
	{#if loading}
		<div
			class="!visible absolute left-0 top-0 flex h-full w-full items-center justify-center bg-transparent text-text"
		>
			<Icon type={Loading} />
		</div>
	{/if}
</button>

<style lang="postcss">
	button {
		@apply relative flex select-none items-center whitespace-nowrap duration-500;
	}
	.size-xl {
		@apply rounded-2xl px-8 py-4 text-xl font-medium;
	}
	.size-lg {
		@apply rounded-xl px-6 py-3 text-base font-medium;
	}
	.size-base {
		@apply min-h-[2.5rem] rounded-lg px-4 py-2 text-sm;
	}
	.size-sm {
		@apply rounded px-2 py-1 text-xs;
	}
	.variant-main {
		@apply transition-[filter,opacity] hover:brightness-110 focus:brightness-110;
	}
	.variant-ghost {
		@apply bg-opacity-30 transition-colors hover:bg-opacity-100;
	}
	.disabled {
		@apply pointer-events-none cursor-default opacity-40;
	}
</style>
