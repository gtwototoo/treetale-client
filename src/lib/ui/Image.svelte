<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLImgAttributes } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	import { Photo } from 'svelte-heros-v2';

	import { clm } from '$lib/utils/classMerge';

	import Icon from './Icon.svelte';
	import Loading from './svg/Loading.svelte';

	let {
		class: classname,
		alt,
		cover,
		base64src,
		src,
		onload,
		onerror,
		error
	}: HTMLImgAttributes & {
		cover?: boolean;
		base64src?: string | null;
		onload?: (e: Event) => void;
		onerror?: (e: string | Event) => void;
		error?: Snippet;
	} = $props();

	const preload = (src?: string | null) => {
		if (!src) {
			return Promise.reject();
		}

		return new Promise((resolve, reject) => {
			const image = new Image();

			image.src = src;

			image.onload = (e: Event) => {
				onload?.(e);
				resolve(e);
			};

			image.onerror = (e) => {
				onerror?.(e);
				reject();
			};
		});
	};
</script>

<div
	class={clm(
		'text-contrast relative flex items-center justify-center bg-transparent select-none *:bg-transparent',
		classname
	)}
	in:fade
>
	{#if base64src && !src}
		<Icon class="z-10 size-6 text-white" this={Loading} />
		<img
			{alt}
			class={clm(
				'rounded-inherit absolute size-full brightness-50',
				cover ? 'object-cover' : 'object-contain'
			)}
			draggable="false"
			src={base64src}
		/>
	{:else}
		{#await preload(src)}
			{#if base64src}
				<Icon class="z-10 size-6 text-white" this={Loading} />
				<img
					{alt}
					class={clm(
						'rounded-inherit absolute size-full brightness-50',
						cover ? 'object-cover' : 'object-contain'
					)}
					draggable="false"
					src={base64src}
				/>
			{:else}
				<Icon class="text-text size-6" this={Loading} />
			{/if}
		{:then}
			<img
				{alt}
				class={clm('rounded-inherit size-full', cover ? 'object-cover' : 'object-contain')}
				draggable="false"
				{src}
			/>
		{:catch}
			{#if error}
				{@render error()}
			{:else}
				<Icon class="text-text h-1/3 min-h-[1rem] w-auto" this={Photo} />
			{/if}
		{/await}
	{/if}
</div>
