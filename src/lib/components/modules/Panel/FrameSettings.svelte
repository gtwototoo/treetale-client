<script lang="ts">
	import { Button, FormSplit, Input, Textarea } from '$UI';
	import DropBlock from '$lib/components/DropBlock.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { saveImage } from '$lib/requests/image';
	import { changesHistory, storyInfo } from '$lib/stores/editing';
	import { panelFrame } from '$lib/stores/newediting';
	import { Photo, RectangleStack } from 'svelte-heros-v2';

	const action = 'storyFrameImageId';

	let imageLoading = false;
	let avatarId = $panelFrame.imageId;

	const preSaveImage = async (file: File): Promise<void> => {
		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onloadend = () => {
			avatarId = reader.result.toString();
		};

		reader.onloadstart = () => {
			imageLoading = true;
		};

		const request = await saveImage(
			file,
			action,
			`&storyId=${$storyInfo.storyId}&frameId=${$panelFrame.frameId}`
		);

		if (request.ok) {
			const data = await request.json();

			imageLoading = false;
			avatarId = data.imageId;

			changesHistory.add({
				title: 'Добавление изображения',
				icon: Photo
			});
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
</div>
