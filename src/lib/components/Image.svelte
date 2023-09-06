<script lang="ts">
	import { Button } from '$UI';
	import { Loading } from '$UI/Icons';
	import { PUBLIC_TIMAGES_DELIVERY_URL } from '$env/static/public';
	import clsx from 'clsx';
	import { createEventDispatcher } from 'svelte';
	import { BookOpen, Trash } from 'svelte-heros-v2';
	import DropBlock from './DropBlock.svelte';
	import Icon from './Icon.svelte';

	export { className as class };
	export let src: string;
	export let alt: string;
	export let state: 'loaded' | 'error' | 'loading' | undefined = undefined;
	export let width: number;
	export let height = width;

	let className = '';
	let preloadImage: string;

	const dispatch = createEventDispatcher();

	const createPreloadImage = async (file: File): Promise<void> => {
		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onloadstart = () => {
			state = 'loading';

			dispatch('loading', { file });
		};

		reader.onloadend = () => {
			if (!reader.result) return;

			preloadImage = reader.result.toString();
		};
	};

	const handleRemove = (e: CustomEvent) => {
		dispatch('remove', e);
	};

	const handleChange = (e: CustomEvent<{ files: FileList }>) => {
		const { files } = e.detail;

		createPreloadImage(files[0]);
	};

	const preload = (src: string) => {
		if (!src) return;

		const image = new Image();

		state = 'loading';

		image.src = src;
		image.onload = () => (state = 'loaded');
		image.onerror = () => (state = 'error');
	};

	$: newSrc = src && `${PUBLIC_TIMAGES_DELIVERY_URL}/${src}?w=${width}&h=${height}`;

	$: preload(newSrc);
</script>

<div class={clsx('relative', className)}>
	{#if state}
		{#if state === 'loaded'}
			<div class="h-full w-full">
				<Button size="sm" on:click={handleRemove} class="!absolute right-1.5 top-1.5 z-[2]">
					<Icon type={Trash} class="h-4 w-4 !text-red-600" />
				</Button>
				<img
					class="h-full w-full rounded-lg bg-white object-cover"
					{alt}
					src={newSrc}
					draggable="false"
				/>
			</div>
		{:else}
			<div
				class="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-white"
			>
				{#if preloadImage}
					<img
						class="h-full w-full object-cover brightness-50"
						draggable="false"
						{alt}
						src={preloadImage}
					/>
				{/if}
				<Icon type={Loading} variation="solid" class="absolute bg-transparent" />
			</div>
		{/if}
	{:else}
		<DropBlock on:change={handleChange} class="h-48 gap-2">
			<Icon type={BookOpen} class="h-24 w-auto childs:fill-[--fill-main]" variation="solid" />
		</DropBlock>
	{/if}
</div>
