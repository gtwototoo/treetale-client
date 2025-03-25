<script lang="ts">
	import type {
		HTMLAnchorAttributes,
		HTMLButtonAttributes,
		MouseEventHandler
	} from 'svelte/elements';

	import { clickHold } from '$lib/hooks/clickHold';
	import { clm } from '$lib/utils/classMerge';

	import Icon from './Icon.svelte';
	import Loading from './svg/Loading.svelte';

	let {
		onholdclick,
		disabled = false,
		loading = false,
		class: classname,
		asLink = false,
		ref = $bindable(),
		children,
		onclick,
		...props
	}: {
		asLink?: boolean;
		onholdclick?: MouseEventHandler<HTMLButtonElement>;
		ref?: HTMLButtonElement | HTMLAnchorElement;
		loading?: boolean;
	} & HTMLButtonAttributes &
		HTMLAnchorAttributes = $props();

	const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
		if (inactive) return;
		onclick?.(e);
	};

	const handleHoldClick: MouseEventHandler<HTMLButtonElement> = (e) => {
		if (inactive) return;
		onholdclick?.(e);
	};

	const inactive = $derived(disabled || loading);
</script>

<svelte:element
	this={asLink ? 'a' : 'button'}
	class={clm(
		'relative flex items-center whitespace-nowrap select-none',
		loading && '!text-transparent *:invisible',
		classname,
		inactive && 'bg-main-100 ring-main-200 pointer-events-none cursor-default'
	)}
	onclick={handleClick}
	onholdclick={handleHoldClick}
	use:clickHold
	role="button"
	tabindex="0"
	{...props}
	bind:this={ref}
>
	{@render children?.()}
	{@render loadingState()}
</svelte:element>

{#snippet loadingState()}
	{#if loading}
		<div
			class="text-text !visible absolute top-0 left-0 flex size-full items-center justify-center bg-transparent"
		>
			<Icon this={Loading} />
		</div>
	{/if}
{/snippet}
