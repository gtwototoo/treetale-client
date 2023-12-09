<script lang="ts">
	import { clsx } from 'clsx';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	import Icon from '$lib/components/Icon.svelte';
	import { Loading } from '$UI/Icons';
	import { Photo } from 'svelte-heros-v2';

	let className = '';
	export { className as class };

	export let src = '';
	export let alt = '';
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
		'relative flex select-none items-center justify-center bg-transparent text-contrast',
		className
	)}
	in:fade
>
	{#await preload(src)}
		<Icon type={Loading} class="h-6 w-6" />
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
</div>
