<script lang="ts">
	import { Trash } from 'svelte-heros-v2';
	import { Button, Icon, Image } from 'treetale-ui';

	import type { HeroIconComponent } from '$lib/types';

	import DropArea from '$lib/components/DropArea.svelte';
	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';

	let {
		alt,
		class: classname,
		disabled = false,
		icon,
		onloadstart,
		onremove,
		readonly = false,
		src
	}: {
		alt?: string;
		class?: string;
		disabled?: boolean;
		icon: HeroIconComponent;
		onloadstart?: (file: File) => void;
		onremove?: () => void;
		readonly?: boolean;
		src?: null | string;
	} = $props();

	let base64src = $state<null | string>();

	const createBase64Image = async (file: File) => {
		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onloadstart = () => {
			onloadstart?.(file);
		};

		reader.onloadend = () => {
			if (!reader.result) return;

			base64src = reader.result.toString();
		};
	};

	const handleChange = (files: File[]) => {
		createBase64Image(files[0]);
	};

	const handleRemove = () => {
		onremove?.();
	};
</script>

<div class={clm('relative h-full min-h-0 rounded-lg', classname)}>
	{#if src || base64src}
		{#if !readonly}
			<Button
				size="sm"
				class={clm('absolute right-1 top-1 z-10 text-red-500', redBackgroundColorStore.color)}
				onclick={handleRemove}
			>
				<Icon class="size-4" this={Trash} />
			</Button>
		{/if}
		<Image
			{alt}
			{base64src}
			class="size-full rounded-inherit bg-main/30 text-text"
			cover
			onload={() => (base64src = null)}
			{src}
		/>
	{:else if readonly || disabled}
		<Button
			class="pointer-events-none size-full flex-col justify-center gap-2 !whitespace-normal rounded-inherit bg-contrast-9 !p-6"
		>
			<Icon class="h-24 w-auto *:fill-gradient" this={icon} variation="solid" />
			<p>Изображение не добавлено</p>
		</Button>
	{:else}
		<DropArea onchange={handleChange} class="relative rounded-inherit bg-main-20">
			<Icon class="h-20 w-auto *:fill-gradient" this={icon} variation="solid" />
			<p>Нажмите тут или перетащите сюда изображение</p>
		</DropArea>
	{/if}
</div>
