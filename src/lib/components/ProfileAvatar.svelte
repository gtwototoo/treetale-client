<script lang="ts">
	import { removeImage, saveImage } from '$lib/requests';
	import type { IUser } from '$lib/types';
	import { Avatar, Button, InputFile } from '$UI';

	import { Photo as PhotoIcon, XMark } from 'svelte-heros-v2';
	import Icon from './Icon.svelte';

	export let userInfo: IUser;
	export let me: boolean;

	let imageLoading = false;
	let tempAvatarURL = '';

	const action = 'avatarId';

	const preRemoveImage = async () => {
		if (tempAvatarURL || !userInfo.avatarId) {
			return;
		}

		imageLoading = true;

		const request = await removeImage(userInfo.avatarId, action);

		if (request.ok) {
			imageLoading = false;
			userInfo.avatarId = null;
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

		const request = await saveImage(file, action);

		if (request.ok) {
			const data = await request.json();

			imageLoading = false;
			tempAvatarURL = '';
			userInfo.avatarId = data.imageId;
		}
	};

	const setFile = (e: Event) => {
		if (e.target instanceof HTMLInputElement && e.target.files) {
			preSaveImage(e.target.files);
		}
	};

	$: src = userInfo.avatarId || tempAvatarURL;
</script>

<Avatar {src} alt={userInfo.name} width={160} class="h-40 w-40 light-gradient-main">
	{#if me}
		<div class="absolute right-0 bottom-0 z-[3] rounded-full bg-main p-1">
			{#if src && !imageLoading}
				<Button class="!rounded-full !p-3" variant="secondaryWhite" on:click={preRemoveImage}>
					<Icon type={XMark} class="text-red-600" />
				</Button>
			{:else}
				<InputFile
					class="!rounded-full !p-3"
					variant="secondaryWhite"
					disabled={imageLoading}
					on:change={setFile}
				>
					<Icon type={PhotoIcon} />
				</InputFile>
			{/if}
		</div>
	{/if}
</Avatar>
