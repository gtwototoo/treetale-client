<script lang="ts">
	import { fade } from 'svelte/transition';

	import { PencilSquare, Trash } from 'svelte-heros-v2';

	import type { RGB, User } from '$lib/types';

	import { BLACK_COLOR, DEFAULT_COLOR, WHITE_COLOR } from '$lib/constants/colors';
	import { removeImage, saveImage } from '$lib/requests/files';
	import { contrastText } from '$lib/utils/contrast';
	import { toRGB } from '$lib/utils/customColors';
	import { Avatar, Button, Icon, InputFile } from 'treetale-ui';

	let {
		user,
		editMode = false,
		size = 'lg',
		color
	}: {
		user: User;
		editMode?: boolean;
		size?: 'base' | 'lg' | 'sm';
		color: RGB | null;
	} = $props();

	let removeLoading = $state(false);
	let addLoading = $state(false);
	let base64src = $state<string | null>(null);
	let src = $state<string | null>(user.imageUrl);

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

	const loadHandler = () => {
		base64src = null;
		addLoading = false;
	};

	let correctColor = $derived(color || DEFAULT_COLOR);
	let colorContrast = $derived(contrastText(correctColor) ? BLACK_COLOR : WHITE_COLOR);
</script>

<div
	class="contents"
	style:--color-contrast={toRGB(colorContrast)}
	style:--color-main={toRGB(correctColor)}
>
	<Avatar alt={user.name} color={correctColor} {base64src} onload={loadHandler} {size} {src}>
		{#if editMode}
			<div
				class="absolute bottom-0 right-0 z-[3] rounded-full bg-main-20 p-1"
				in:fade={{ duration: 150 }}
			>
				{#if src}
					<Button
						class="rounded-full bg-main p-3 text-text"
						loading={removeLoading}
						onclick={preRemoveImage}
					>
						<Icon class="size-6 text-red-500" this={Trash} />
					</Button>
				{:else}
					<InputFile
						class="rounded-full bg-main p-3 text-text"
						disabled={addLoading}
						onchange={setFile}
					>
						<Icon class="size-6" this={PencilSquare} />
					</InputFile>
				{/if}
			</div>
		{/if}
	</Avatar>
</div>
