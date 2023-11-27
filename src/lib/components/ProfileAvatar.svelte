<script lang="ts">
	import { PencilSquare, XMark } from 'svelte-heros-v2';
	import { fade } from 'svelte/transition';

	import Icon from './Icon.svelte';

	import { Avatar, Button, InputFile } from '$UI';
	import { BLACK_COLOR, DEFAULT_COLOR, WHITE_COLOR } from '$lib/constants';
	import { removeImage, saveImage } from '$lib/requests/image';
	import type { IUser } from '$lib/types';
	import { RGB, alphaToRgb, contrastText } from '$lib/utils';

	export let user: IUser;
	export let editMode: boolean = false;
	export let size: 'sm' | 'base' | 'lg' = 'lg';
	export let width: number = 160;

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
	$: color = user.color && user.color.length ? user.color : DEFAULT_COLOR;
</script>

<div
	class="contents"
	style:--color-main={RGB(color)}
	style:--color-main-50={RGB(
		alphaToRgb(color, 0.5, contrastText(color) ? BLACK_COLOR : WHITE_COLOR)
	)}
	style:--color-main-90={RGB(
		alphaToRgb(color, 0.9, contrastText(color) ? BLACK_COLOR : WHITE_COLOR)
	)}
>
	<Avatar
		{size}
		{src}
		alt={user.name}
		{width}
		class="bg-gradient-to-t from-main-90 to-main-50 text-main"
	>
		{#if editMode}
			<div
				class="absolute bottom-0 right-0 z-[3] rounded-full bg-main-20 p-1"
				in:fade={{ duration: 150 }}
			>
				{#if src && !imageLoading}
					<Button
						class="!rounded-full bg-main !p-3 text-text"
						variant="ghost"
						on:click={preRemoveImage}
					>
						<Icon type={XMark} class="h-6 w-6 text-red-500" />
					</Button>
				{:else}
					<InputFile
						class="!rounded-full bg-main !p-3 text-text"
						variant="ghost"
						disabled={imageLoading}
						on:change={setFile}
					>
						<Icon type={PencilSquare} class="h-6 w-6" />
					</InputFile>
				{/if}
			</div>
		{/if}
	</Avatar>
</div>
