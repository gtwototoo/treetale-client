<script lang="ts">
	import { Button, Image } from '$UI';
	import { redColorStore } from '$lib/stores/main';
	import { clm } from '$lib/utils';
	import clsx from 'clsx';
	import { createEventDispatcher, type SvelteComponent } from 'svelte';
	import { Trash } from 'svelte-heros-v2';
	import DropBlock from './DropBlock.svelte';
	import Icon from './Icon.svelte';

	export let icon: typeof SvelteComponent<unknown>;
	export let disabled = false;
	export let readonly = false;
	export let src: string | undefined = undefined;
	export let alt: string;

	let className = '';
	export { className as class };

	const dispatch = createEventDispatcher();

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

	const handleChange = (e: CustomEvent<FileList>) => {
		const files = e.detail;

		createBase64Image(files[0]);
	};

	const handleRemove = (e: CustomEvent) => {
		dispatch('remove', e);
	};
</script>

<div class={clm('relative h-full min-h-0 rounded-lg', className)}>
	{#if src || base64src}
		{#if !readonly}
			<Button
				variant="main"
				size="sm"
				on:click={handleRemove}
				class={clsx('!absolute right-2 top-2 z-10 !text-red-500', $redColorStore)}
			>
				<Icon type={Trash} class="h-4 w-4" />
			</Button>
		{/if}
		<Image
			{alt}
			{src}
			{base64src}
			on:load={() => (base64src = null)}
			class="h-full w-full rounded-inherit !bg-main/30 text-text"
			cover
		/>
	{:else if readonly}
		<Button
			variant="ghost"
			class="bg-contrast-9 pointer-events-none h-full w-full flex-col gap-2 !whitespace-normal !rounded-inherit !p-6"
		>
			<Icon type={icon} class="h-24 w-auto childs:fill-gradient" variation="solid" />
			<p>Изображение не добавлено</p>
		</Button>
	{:else}
		<DropBlock on:change={handleChange} class="h-full w-full gap-2 !rounded-inherit" {disabled}>
			<Icon type={icon} class="h-24 w-auto childs:fill-gradient" variation="solid" />
		</DropBlock>
	{/if}
</div>
