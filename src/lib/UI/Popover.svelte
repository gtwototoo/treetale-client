<script lang="ts">
	import { fly } from 'svelte/transition';

	import { clsx } from 'clsx';
	import { ChevronDown } from 'svelte-heros-v2';

	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { clickOutside, correctPosition } from '$lib/hooks';
	import { clm } from '$lib/utils';

	let className = '';
	export { className as class };

	export let btnClass = '';
	export let disabled = false;
	export let readonly = false;
	export let align: 'center' | 'inset' | 'left' | 'right' = 'left';
	export let value = '';
	export let placeholder = '';

	let containerRef: HTMLDivElement;
	let contentRef: HTMLDivElement;

	let focused = false;

	const handleClick = () => {
		if (readonly) return;

		focused = !focused;
	};

	$: if (focused && containerRef && contentRef) {
		const button = containerRef.childNodes[0] as HTMLButtonElement;
		const space = 4;

		switch (align) {
			case 'inset':
				contentRef.style.setProperty('width', `${button.clientWidth}px`);
				break;
			case 'center':
				contentRef.style.setProperty(
					'left',
					`-${contentRef.clientWidth / 2 - button.clientWidth / 2}px`
				);
				break;
			case 'left':
				contentRef.style.setProperty('left', `${space}px`);
				break;
			case 'right':
				contentRef.style.setProperty(
					'left',
					`-${contentRef.clientWidth - button.clientWidth - space}px`
				);
				break;
		}

		const { width, x } = contentRef.getBoundingClientRect();
		const left = +contentRef.style.getPropertyValue('left').split('px')[0];

		if (x + width >= window.innerWidth) {
			contentRef.style.setProperty('left', `${left - (x + width - window.innerWidth)}px`);
		}
		if (x <= 0) {
			contentRef.style.setProperty('left', `${left + Math.abs(x)}px`);
		}
	}
</script>

<div
	bind:this={containerRef}
	class={clsx('relative bg-transparent', className)}
	on:outclick={() => (focused = false)}
	use:clickOutside
>
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
			bind:this={contentRef}
			class="absolute z-[4] rounded-lg bg-contrast text-text shadow"
			in:fly={{ y: 10 }}
			use:correctPosition
		>
			<slot />
		</div>
	{/if}
</div>
