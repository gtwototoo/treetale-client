<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	import clsx from 'clsx';
	import { Trash } from 'svelte-heros-v2';

	import { Button, Image } from '$UI';
	import { redColorStore } from '$lib/stores/main';
	import { clm } from '$lib/utils';

	import DropArea from './DropArea.svelte';
	import Icon from './Icon.svelte';

	const dispatch = createEventDispatcher<{
		loadstart: File;
		remove: null;
	}>();

	export let icon: typeof SvelteComponent<unknown>;
	export let disabled = false;
	export let readonly = false;
	export let src: string | undefined = undefined;
	export let alt: string;

	let className = '';
	export { className as class };

	let base64src: string = null;

	const createBase64Image = async (file: File) => {
		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onloadstart = () => {
			dispatch('loadstart', file);
		};

		reader.onloadend = () => {
			if (!reader.result) return;

			base64src = reader.result.toString();
		};
	};

	const handleChange = (e: CustomEvent<Array<File>>) => {
		const files = e.detail;

		createBase64Image(files[0]);
	};

	const handleRemove = () => {
		dispatch('remove');
	};
</script>

<div class={clm('relative h-full min-h-0 rounded-lg', className)}>
	{#if src || base64src}
		{#if !readonly}
			<Button
				class={clsx('!absolute right-2 top-2 z-10 !text-red-500', $redColorStore)}
				on:click={handleRemove}
				size="sm"
				variant="main"
			>
				<Icon class="size-4" type={Trash} />
			</Button>
		{/if}
		<Image
			{alt}
			{base64src}
			class="size-full rounded-inherit !bg-main/30 text-text"
			cover
			on:load={() => (base64src = null)}
			{src}
		/>
	{:else if readonly || disabled}
		<Button
			class="pointer-events-none size-full flex-col gap-2 !whitespace-normal !rounded-inherit bg-contrast-9 !p-6"
			variant="ghost"
		>
			<Icon class="h-24 w-auto *:fill-gradient" type={icon} variation="solid" />
			<p>Изображение не добавлено</p>
		</Button>
	{:else}
		<DropArea on:change={handleChange} class="relative rounded-inherit bg-main-20">
			<Icon class="h-20 w-auto *:fill-gradient" type={icon} variation="solid" />
			<p>Нажмите тут или перетащите сюда изображение</p>
		</DropArea>
	{/if}
</div>
