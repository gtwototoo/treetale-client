<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	import upperFirst from 'lodash/upperFirst';
	import { Trash } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import DropArea from '$lib/components/DropArea/index.svelte';
	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';

	let {
		base64src = $bindable(),
		children,
		class: classname,
		disabled = false,
		icon,
		mediaType,
		onloadend,
		onloadstart,
		onremove,
		readonly = false,
		src
	}: {
		base64src: string;
		children: Snippet<[null | string | undefined, () => void]>;
		class?: string;
		disabled?: boolean;
		icon: Component;
		mediaType: 'audio' | 'image';
		onloadend?: (base64src: string) => void;
		onloadstart?: (file: File) => void;
		onremove?: () => void;
		readonly?: boolean;
		src?: null | string;
	} = $props();

	const createBase64File = async (file: File) => {
		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onloadstart = () => {
			onloadstart?.(file);
		};

		reader.onloadend = () => {
			if (!reader.result) return;

			base64src = reader.result.toString();

			onloadend?.(base64src);
		};
	};

	const handleChange = (files: File[]) => {
		createBase64File(files[0]);
	};

	const handleRemove = () => {
		onremove?.();
	};

	const base64Clear = () => {
		base64src = '';
	};

	const mediaName = mediaType === 'image' ? 'изображение' : 'звук';
</script>

{#snippet removeButton()}
	{#if !(readonly || disabled)}
		<Button
			size="sm"
			class={clm('absolute top-1 right-1 z-10', redBackgroundColorStore.color)}
			onclick={handleRemove}
		>
			<Icon class="size-4" this={Trash} />
		</Button>
	{/if}
{/snippet}

<div class={clm('relative h-full min-h-0 rounded-lg', classname)}>
	{#if src || base64src}
		{@render removeButton()}
		{@render children?.(base64src, base64Clear)}
	{:else if !(readonly || disabled)}
		<DropArea
			onchange={handleChange}
			class="rounded-inherit bg-main-200 relative"
			accept={mediaType + '/*'}
		>
			<Icon class="*:fill-gradient h-20 w-auto" this={icon} variation="solid" />
			<p>Нажмите тут или перетащите сюда {mediaName}</p>
		</DropArea>
	{:else}
		<Button
			class="rounded-inherit bg-contrast-900 pointer-events-none size-full flex-col justify-center gap-2 !p-6 !whitespace-normal"
		>
			<Icon class="*:fill-gradient h-24 w-auto" this={icon} variation="solid" />
			<p>{upperFirst(mediaName)} отсутствует</p>
		</Button>
	{/if}
</div>
