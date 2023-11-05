<script lang="ts">
	import { fade } from 'svelte/transition';
	import { PencilSquare, XMark } from 'svelte-heros-v2';

	import Icon from './Icon.svelte';

	import { removeImage, saveImage } from '$lib/requests/image';
	import type { IUser } from '$lib/types';
	import { Avatar, Button, InputFile } from '$UI';



	export let user: IUser;
	export let editMode: boolean;

	let imageLoading = false;
	let tempAvatarURL = '';

	const action = 'avatarId';

	const preRemoveImage = async () => {
		if (tempAvatarURL || !user.avatarId) {
			return;
		}

		imageLoading = true;

		try {
			await removeImage(user.avatarId, action);

			user.avatarId = null;
		} finally {
			imageLoading = false;
		}
	};

	const preSaveImage = async ([file]: FileList): Promise<void> => {
		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onloadend = () => {
			if (!reader.result) return;

			tempAvatarURL = reader.result.toString();
		};

		reader.onloadstart = () => {
			imageLoading = true;
		};

		try {
			const response = await saveImage(file, action);

			user.avatarId = response.imageId;
			imageLoading = false;
			tempAvatarURL = '';
		} catch (e) {
			console.error(e);
		}
	};

	const setFile = (e: Event) => {
		if (e.target instanceof HTMLInputElement && e.target.files) {
			preSaveImage(e.target.files);
		}
	};

	$: src = user.avatarId || tempAvatarURL;
</script>

<Avatar size="lg" {src} alt={user.name} width={160} class="light-gradient-main">
	{#if editMode}
		<div
			class="absolute bottom-0 right-0 z-[3] rounded-full bg-main-20 p-1"
			in:fade={{ duration: 150 }}
		>
			{#if src && !imageLoading}
				<Button class="!rounded-full !p-3" variant="secondary" on:click={preRemoveImage}>
					<Icon type={XMark} class="text-red-500 w-6 h-6" />
				</Button>
			{:else}
				<InputFile
					class="!rounded-full !p-3 text-text bg-main"
					variant="ghost"
					disabled={imageLoading}
					on:change={setFile}
				>
					<Icon type={PencilSquare} class="w-6 h-6" />
				</InputFile>
			{/if}
		</div>
	{/if}
</Avatar>
