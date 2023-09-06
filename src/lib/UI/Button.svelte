<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { clickHold } from '$lib/hooks';
	import { Loading } from '$UI/Icons';
	import { clsx } from 'clsx';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let className = '';
	export { className as class };

	export let style: string | undefined = undefined;
	export let variant: 'secondary' | 'main' | 'transparent' | 'secondary-white' | 'ghost' =
		'secondary';
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
	class={clsx(
		'childs:bg-transparent',
		{ disabled: disabled || loading },
		`size-${size}`,
		`variant-${variant}`,
		className,
		{
			'text-transparent childs:invisible': loading
		}
	)}
	{style}
	on:click={handleClick}
	on:holdclick={handleHoldClick}
	use:clickHold
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
		@apply rounded-lg px-4 py-2 text-sm;
	}
	.size-sm {
		@apply rounded px-2 py-1 text-xs;
	}
	.variant-secondary {
		@apply bg-gray-50 text-black transition-colors hover:bg-white hover:text-blue-500 focus:bg-white focus:text-blue-500;
	}
	.variant-secondary-white {
		@apply bg-white text-black transition-colors hover:text-blue-500 focus:bg-gray-100 focus:text-blue-500;
	}
	.variant-main {
		@apply text-white transition-[filter] hover:brightness-110 focus:brightness-110;
	}
	.variant-ghost {
		@apply bg-opacity-30 transition-colors hover:bg-opacity-100;
	}
	.variant-transparent {
		@apply transition-[filter] hover:brightness-90 focus:brightness-90;
	}
	.disabled {
		@apply pointer-events-none cursor-default opacity-40;
	}
</style>
