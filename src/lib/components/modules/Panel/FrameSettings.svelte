<script lang="ts">
	import { Button, FormSplit, Input, Textarea } from '$UI';
	import DropBlock from '$lib/components/DropBlock.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { saveImage } from '$lib/requests/image';
	import { changesHistory, frames, storyInfo } from '$lib/stores/editing';
	import { panelFrameStore, selectedFrameStore } from '$lib/stores/newediting';
	import type { IFrame } from '$lib/types';
	import { getFrameFromId } from '$lib/utils';
	import { Photo, RectangleStack, Trash } from 'svelte-heros-v2';

	const action = 'storyFrameImageId';

	$: ({ x, y, choices, text, imageId } = getFrameFromId($frames, $selectedFrameStore));

	let imageLoading = false;
	let avatarId = imageId;

	const preSaveImage = async (file: File): Promise<void> => {
		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onloadend = () => {
			avatarId = reader.result.toString();
		};

		reader.onloadstart = () => {
			imageLoading = true;
		};

		try {
			const response = await saveImage(
				file,
				action,
				`&storyId=${$storyInfo.storyId}&frameId=${$panelFrameStore.frameId}`
			);

			avatarId = response.imageId;
			imageLoading = false;

			changesHistory.add('Добавление изображения', Photo);
		} catch (e) {
			console.error(e);
		}
	};

	const setFile = (e: CustomEvent<{ files: FileList }>) => {
		const { files } = e.detail;

		preSaveImage(files[0]);
	};

	const outputCorrect = (frame: IFrame) => {
		const outputOnFirstOrRemovedFrame = $panelFrameStore.choices.find(
			({ frameId }) => frameId === $frames[0].frameId || frameId === $panelFrameStore.frameId
		);

		if (outputOnFirstOrRemovedFrame) {
			outputOnFirstOrRemovedFrame.frameId = null;
		}
	};

	const removeFrame = () => {
		$frames = $frames.filter(({ frameId }) => frameId !== $panelFrameStore.frameId);

		for (const frame of $frames) {
			outputCorrect(frame);
		}

		changesHistory.add('Удаление фрейма', Trash);
	};
</script>

<FormSplit class="w-full">
	<Input value={`${x}`} placeholder="x" class="flex-1 !text-center" number />
	<Input value={`${y}`} placeholder="y" class="flex-1 !text-center" number />
</FormSplit>
<DropBlock on:change={setFile} class="h-48 gap-2">
	<Icon type={RectangleStack} class="h-24 w-auto childs:fill-gradient" variation="solid" />
</DropBlock>
<Textarea placeholder="Описание" value={text} />
<FormSplit vertical>
	{#each choices as choice}
		<Input placeholder="Вариант выбора" bind:value={choice.text} />
	{/each}
	<Button>Добавить вариант</Button>
</FormSplit>
<Button class="mt-4 justify-center !text-red-500 !bg-red-50" on:click={removeFrame}>
	Удалить фрейм
</Button>
