<script lang="ts">
	import { clsx } from 'clsx';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	import Icon from '$lib/components/Icon.svelte';
	import { Loading } from '$UI/Icons';
	import { Photo } from 'svelte-heros-v2';

	let className = '';
	export { className as class };

	export let alt: string;
	export let src = '';
	export let base64src = '';
	export let cover = false;

	const dispatch = createEventDispatcher();

	const preload = (src: string) => {
		return new Promise((resolve, reject) => {
			const image = new Image();

			image.src = src;

			image.onload = (e) => {
				dispatch('load', e);
				resolve(e);
			};

			image.onerror = (e) => {
				dispatch('error', e);
				reject();
			};
		});
	};
</script>

<div
	class={clsx(
		'relative flex select-none items-center justify-center bg-transparent text-contrast childs:bg-transparent',
		className
	)}
	in:fade
>
	{#if base64src && !src}
		<Icon type={Loading} class="z-10 h-6 w-6 text-white" />
		<img
			class={clsx(
				'absolute h-full w-full rounded-inherit brightness-50',
				cover ? 'object-cover' : 'object-contain'
			)}
			draggable="false"
			src={base64src}
			{alt}
		/>
	{:else}
		{#await preload(src)}
			{#if base64src}
				<Icon type={Loading} class="z-10 h-6 w-6 text-white" />
				<img
					class={clsx(
						'absolute h-full w-full rounded-inherit brightness-50',
						cover ? 'object-cover' : 'object-contain'
					)}
					draggable="false"
					src={base64src}
					{alt}
				/>
			{:else}
				<Icon type={Loading} class="h-6 w-6" />
			{/if}
		{:then}
			<img
				{src}
				{alt}
				draggable="false"
				class={clsx('h-full w-full rounded-inherit', cover ? 'object-cover' : 'object-contain')}
			/>
		{:catch}
			{#if $$slots.error}
				<slot name="error" />
			{:else}
				<Icon type={Photo} class="h-6 w-6" />
			{/if}
		{/await}
	{/if}
</div>
