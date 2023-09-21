<script lang="ts">
	import { Button, FormSplit, Input, Textarea } from '$UI';
	import DropBlock from '$lib/components/DropBlock.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { saveImage } from '$lib/requests/image';
	import { changesHistory, storyInfo } from '$lib/stores/editing';
	import { panelFrameStore } from '$lib/stores/newediting';
	import { Photo, RectangleStack } from 'svelte-heros-v2';

	const action = 'storyFrameImageId';

	let imageLoading = false;
	let avatarId = $panelFrameStore.imageId;

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

			changesHistory.add({
				title: 'Добавление изображения',
				icon: Photo
			});
		} catch (e) {
			console.error(e);
		}
	};

	const setFile = (e: CustomEvent<{ files: FileList }>) => {
		const { files } = e.detail;

		preSaveImage(files[0]);
	};
</script>

<div
	class="flex flex-col items-stretch gap-4 p-3"
	style="--fill-main: url(#light-gradient-{$storyInfo.storyId})"
>
	<DropBlock on:change={setFile} class="h-48 gap-2">
		<Icon type={RectangleStack} class="h-24 w-auto childs:fill-[--fill-main]" variation="solid" />
	</DropBlock>
	<Textarea placeholder="Описание" />
	<FormSplit vertical>
		<Input placeholder="Вариант выбора" />
		<Button>Добавить вариант</Button>
	</FormSplit>
	<Button class="mt-4 justify-center !text-red-500 !bg-red-50">Удалить фрейм</Button>
</div>
