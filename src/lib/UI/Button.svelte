<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Icon from '$lib/components/Icon.svelte';
	import { clickHold } from '$lib/hooks';
	import { clm } from '$lib/utils';
	import { Loading } from '$UI/Icons';

	const dispatch = createEventDispatcher();

	let className = '';
	export { className as class };

	export let variant: 'main' | 'ghost' | 'custom';
	export let size: 'sm' | 'base' | 'lg' | 'xl' = 'base';
	export let disabled = false;
	export let loading = false;
	export let element: HTMLButtonElement | undefined = undefined;
	export let value: string | undefined = undefined;
	export let type: 'button' | 'submit' | 'reset' | undefined = 'button';

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
	use:clickHold
	on:click={handleClick}
	on:holdclick={handleHoldClick}
	on:dragenter
	on:dragleave
	on:drop
	class={clm(
		'childs:bg-transparent transition-opacity',
		`size-${size}`,
		loading && 'text-transparent childs:invisible',
		variant !== 'custom' && `variant-${variant}`,
		(disabled || loading) && 'disabled',
		className
	)}
	{...{ value, type }}
>
	<slot />
	{#if loading}
		<div
			class="!visible absolute left-0 top-0 flex h-full w-full items-center justify-center bg-transparent"
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
		@apply text-white transition-[filter,opacity] hover:brightness-110 focus:brightness-110;
	}
	.variant-ghost {
		@apply bg-opacity-30 transition-colors hover:bg-opacity-100;
	}
	.disabled {
		@apply pointer-events-none cursor-default opacity-40;
	}
</style>
