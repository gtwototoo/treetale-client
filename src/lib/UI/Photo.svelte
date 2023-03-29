<script lang="ts">
	import { PUBLIC_TIMAGES_DELIVERY_URL } from '$env/static/public';
	import Icon from '$lib/components/Icon.svelte';
	import { Loading } from '$UI/Icons';
	import { clsx } from 'clsx';
	import { createEventDispatcher, onMount } from 'svelte';
	import { Photo as PhotoIcon } from 'svelte-heros-v2';
	import { fade } from 'svelte/transition';

	export let src: string = '';
	export let alt: string = '';
	export let cover = false;
	let classes = '';
	export { classes as class };
	export let width: number;
	export let height = width;

	let loaded = false;

	const dispatch = createEventDispatcher();

	const emptyImage = (width: number, height: number) => {
		const canvas = document.createElement('canvas');

		canvas.width = width;
		canvas.height = height || width;

		const ctx = canvas.getContext('2d');

		if (!ctx) return '';

		ctx.fillStyle = 'rgba(0, 0, 0, 0)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		return canvas.toDataURL();
	};

	let ready = false;
	let empty = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

	onMount(() => {
		empty = emptyImage(width, height);
		ready = true;
	});

	$: newSrc =
		src && !src.includes('://') && !src.startsWith('data:')
			? `${PUBLIC_TIMAGES_DELIVERY_URL}/${src}?w=${width}&h=${height}`
			: src;

	const preload = (src: string) => {
		return new Promise((resolve, reject) => {
			const image = new Image();

			image.src = src;
			image.onload = (e) => {
				loaded = true;
				resolve(e);
			};
			image.onerror = (e) => {
				loaded = false;
				dispatch('error', e);
				reject();
			};
		});
	};
</script>

{#if ready}
	<div
		class={clsx(
			'relative flex items-center justify-center overflow-hidden childs:shrink-0',
			classes
		)}
		in:fade
	>
		{#await preload(newSrc)}
			<div class="absolute">
				<Icon type={Loading} />
				<img
					draggable="false"
					src={empty}
					alt="Загрузка..."
					class="h-full w-full rounded-inherit"
				/>
			</div>
		{:then}
			<img
				src={newSrc}
				{alt}
				draggable="false"
				class={clsx('h-full w-full rounded-inherit', cover ? 'object-cover' : 'object-contain')}
			/>
		{:catch}
			<div class="absolute">
				{#if $$slots.error}
					<slot name="error" />
				{:else}
					<Icon type={PhotoIcon} class="text-red-600" />
				{/if}
			</div>
			<img
				draggable="false"
				src={empty}
				alt="Ошибка загрузки"
				class="h-full w-full rounded-inherit"
			/>
		{/await}
	</div>
{/if}
