<script lang="ts">
	import { fade } from 'svelte/transition';

	import { PencilSquare, Trash } from 'svelte-heros-v2';

	import type { IUser, TRGB } from '$lib/types';

	import { removeImage, saveImage } from '$lib/requests/files';
	import { Avatar, Button, InputFile } from '$UI';

	import Icon from './Icon.svelte';

	export let user: IUser;
	export let editMode: boolean = false;
	export let size: 'base' | 'lg' | 'sm' = 'lg';
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
			const { fileUrl } = await saveImage(file, imageFolder);

			src = fileUrl;
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
	alt={user.name}
	{base64src}
	{color}
	on:load={() => {
		base64src = null;
		addLoading = false;
	}}
	{size}
	{src}
>
	{#if editMode}
		<div
			class="absolute bottom-0 right-0 z-[3] rounded-full bg-main-20 p-1"
			in:fade={{ duration: 150 }}
		>
			{#if src}
				<Button
					class="!rounded-full bg-main !p-3 text-text"
					loading={removeLoading}
					on:click={preRemoveImage}
					variant="ghost"
				>
					<Icon class="h-6 w-6 text-red-500" type={Trash} />
				</Button>
			{:else}
				<InputFile
					class="!rounded-full bg-main !p-3 text-text"
					disabled={addLoading}
					on:change={setFile}
					variant="ghost"
				>
					<Icon class="h-6 w-6" type={PencilSquare} />
				</InputFile>
			{/if}
		</div>
	{/if}
</Avatar>
