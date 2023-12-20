<script lang="ts">
	import { PencilSquare, Trash } from 'svelte-heros-v2';
	import { fade } from 'svelte/transition';

	import Icon from './Icon.svelte';

	import { Avatar, Button, InputFile } from '$UI';
	import { removeImage, saveImage } from '$lib/requests/image';
	import type { IUser, TRGB } from '$lib/types';

	export let user: IUser;
	export let editMode: boolean = false;
	export let size: 'sm' | 'base' | 'lg' = 'lg';
	export let color: TRGB;

	let removeLoading = false;
	let addLoading = false;
	let base64src: string = null;
	let src: string = user.imageUrl;

	const imageFolder = 'avatars';

	const preRemoveImage = async () => {
		if (base64src || !src) {
			return;
		}

		removeLoading = true;

		try {
			await removeImage(imageFolder);

			src = null;
		} finally {
			removeLoading = false;
		}
	};

	const preSaveImage = async (file: File): Promise<void> => {
		addLoading = true;

		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onloadend = () => {
			if (!reader.result) return;

			base64src = reader.result.toString();
		};

		try {
			const { imageUrl } = await saveImage(file, imageFolder);

			src = imageUrl;
		} catch (e) {
			console.error(e);
		}
	};

	const setFile = (e: Event) => {
		if (!(e.target instanceof HTMLInputElement) || !e.target.files) {
			return;
		}

		preSaveImage(e.target.files[0]);
	};
</script>

<Avatar
	{size}
	{color}
	{src}
	{base64src}
	alt={user.name}
	on:load={() => {
		base64src = null;
		addLoading = false;
	}}
>
	{#if editMode}
		<div
			class="absolute bottom-0 right-0 z-[3] rounded-full bg-main-20 p-1"
			in:fade={{ duration: 150 }}
		>
			{#if src}
				<Button
					class="!rounded-full bg-main !p-3 text-text"
					variant="ghost"
					loading={removeLoading}
					on:click={preRemoveImage}
				>
					<Icon type={Trash} class="h-6 w-6 text-red-500" />
				</Button>
			{:else}
				<InputFile
					class="!rounded-full bg-main !p-3 text-text"
					variant="ghost"
					disabled={addLoading}
					on:change={setFile}
				>
					<Icon type={PencilSquare} class="h-6 w-6" />
				</InputFile>
			{/if}
		</div>
	{/if}
</Avatar>
