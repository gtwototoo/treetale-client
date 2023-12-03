<script lang="ts">
	import { redColorStore } from '$lib/stores/main';
	import Button from '$UI/Button.svelte';
	import { Loading } from '$UI/Icons';
	import clsx from 'clsx';
	import { createEventDispatcher, type SvelteComponent } from 'svelte';
	import { Trash } from 'svelte-heros-v2';
	import DropBlock from './DropBlock.svelte';
	import Icon from './Icon.svelte';

	export let icon: typeof SvelteComponent<unknown>;
	export let disabled = false;
	export let src: string | undefined = undefined;
	export let loadError = false;
	export let alt: string;

	const dispatch = createEventDispatcher();

	let loading = false;
	let preloadBaseImage: string = null;

	const createPreloadBaseImage = async (file: File) => {
		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onloadstart = () => {
			loading = true;

			dispatch('loadstart', file);
		};

		reader.onloadend = () => {
			if (!reader.result) return;

			preloadBaseImage = reader.result.toString();
		};
	};

	const handleChange = (e: CustomEvent<{ files: FileList }>) => {
		const { files } = e.detail;

		createPreloadBaseImage(files[0]);
	};

	const preloadImage = (src: string) => {
		if (!src) return;

		loadError = false;
		loading = true;

		const image = new Image();

		image.src = src;
		image.onload = () => {
			loading = false;
		};
		image.onerror = () => {
			loadError = true;
			loading = false;
		};
	};

	const handleRemove = (e: CustomEvent) => {
		dispatch('remove', e);
	};

	$: preloadImage(src);
</script>

<div class="relative h-48">
	{#if loading && !loadError}
		<div class="flex h-full w-full items-center justify-center rounded-lg bg-main">
			<Icon type={Loading} variation="solid" class="absolute z-10 bg-transparent" />
			{#if preloadBaseImage}
				<img
					class="h-full w-full rounded-lg object-cover brightness-50"
					draggable="false"
					src={preloadBaseImage}
					{alt}
				/>
			{/if}
		</div>
	{:else if !loading && src && !loadError}
		<img {src} {alt} class="h-full w-full rounded-lg object-cover" draggable="false" />
		<Button
			variant="main"
			size="sm"
			on:click={handleRemove}
			class={clsx('!absolute right-1.5 top-1.5 !text-red-500', $redColorStore)}
		>
			<Icon type={Trash} class="h-4 w-4" />
		</Button>
	{:else}
		<DropBlock on:change={handleChange} class="h-full w-full gap-2" {disabled}>
			<Icon type={icon} class="h-24 w-auto childs:fill-gradient" variation="solid" />
		</DropBlock>
	{/if}
</div>
