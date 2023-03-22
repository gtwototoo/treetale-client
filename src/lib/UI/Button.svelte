<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { clickHold } from '$lib/hooks';
	import { Loading } from '$UI/Icons';
	import { clsx } from 'clsx';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let styles: string = '';
	export { styles as class };
	export let style: string | undefined = undefined;
	export let variant: 'secondary' | 'main' | 'transparent' | 'secondaryWhite' = 'secondary';
	export let size: 'small' | 'default' | 'big' = 'default';
	export let disabled: boolean = false;
	export let loading: boolean = false;
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
	class={clsx('childs:bg-transparent', { disabled: disabled || loading }, size, variant, styles, {
		'childs:invisible text-transparent': loading
	})}
	{style}
	on:click={handleClick}
	on:holdclick={handleHoldClick}
	use:clickHold
	{...{ value, type }}
>
	<slot />
	{#if loading}
		<div
			class="!visible absolute top-0 left-0 flex h-full w-full items-center justify-center bg-transparent"
		>
			<Icon type={Loading} />
		</div>
	{/if}
</button>

<style lang="postcss">
	button {
		@apply relative flex items-center whitespace-nowrap rounded-lg duration-500;
	}
	.big {
		@apply px-8 py-4 text-base;
	}
	.default {
		@apply px-4 py-2 text-sm;
	}
	.small {
		@apply p-2 text-sm;
	}
	.secondary {
		@apply bg-gray-200 text-black transition-colors hover:bg-gray-100 hover:text-blue-500 focus:bg-gray-100 focus:text-blue-500;
	}
	.secondaryWhite {
		@apply bg-white text-black transition-colors hover:text-blue-500 focus:bg-gray-100 focus:text-blue-500;
	}
	.main {
		@apply text-white transition-[filter] hover:brightness-110 focus:brightness-110;
	}
	.transparent {
		@apply transition-[filter] hover:brightness-90 focus:brightness-90;
	}
	.disabled {
		@apply pointer-events-none cursor-default opacity-40;
	}
</style>
