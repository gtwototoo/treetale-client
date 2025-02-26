<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';

	import find from 'lodash/find';
	import { BookOpen, Photo } from 'svelte-heros-v2';
	import { Button, Icon, InputFile } from 'treetale-ui';

	import InvisibleDrop from '$lib/components/InvisibleDrop.svelte';
	import Cover from '$lib/components/StoryCard/Cover.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { GENRES_LIST } from '$lib/constants/genres';
	import { ILLUSTRATIONS_FOLDER } from '$lib/constants/s3forders';
	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';

	import { removeImage, saveImage } from '$board/requests/files';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { storyInfoStore } from '$board/stores/info.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';

	let { color, imageUrl, title } = $derived(storyInfoStore.info!);

	const handleDrop = (files: File[]) => {
		const file = files[0];

		preSaveImage(file);
	};

	const preRemoveImage = async () => {
		if (!storyInfoStore.info || !storyInfoStore.info.imageUrl) return;

		try {
			await removeImage(ILLUSTRATIONS_FOLDER, {
				storyId: storyInfoStore.info.storyId
			});

			storyInfoStore.info.imageUrl = null;
		} catch (error) {
			console.error(error);
		}
	};

	const preSaveImage = async (file: File): Promise<void> => {
		if (!storyInfoStore.info) return;

		try {
			const { message } = await saveImage(file, ILLUSTRATIONS_FOLDER, {
				storyId: storyInfoStore.info.storyId
			});

			storyInfoStore.info.imageUrl = message.fileUrl;

			changesHistoryStore.add('Добавление изображения истории', Photo);
		} catch (error) {
			console.error(error);
		}
	};

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		const file = (e.target as HTMLInputElement).files?.[0];

		if (!file) return;

		preSaveImage(file);
	};

	let genre = $derived(find(GENRES_LIST, { id: storyInfoStore.info?.genre || 'adventure' })!);
</script>

<InvisibleDrop onchange={handleDrop}>
	<Icon this={BookOpen} variation="solid" class="*:fill-gradient h-24 w-auto" />
	<p>Перетащите сюда изображение, чтобы заменить текущее в блоке</p>
</InvisibleDrop>
<div class="flex justify-center">
	<Cover
		icon={genre.icon}
		{title}
		color={color || DEFAULT_COLOR}
		{imageUrl}
		editMode={panelStatesStore.editMode}
	/>
</div>
{#if imageUrl}
	<Button class={clm('justify-center', redBackgroundColorStore.color)} onclick={preRemoveImage}>
		Удалить иллюстрацию
	</Button>
{:else if !imageUrl && !readonlyModeStore.isEnabled}
	<InputFile
		class="bg-contrast-7 text-text hover:bg-contrast-9 justify-center"
		onchange={handleChange}
	>
		Добавить иллюстрацию
	</InputFile>
{/if}
