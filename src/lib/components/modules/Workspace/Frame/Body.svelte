<script lang="ts">
	import className from '$lib/classnames';
	import DropArea from '$lib/components/DropArea.svelte';
	import { iconsType } from '$lib/constants';
	import { removeImage, saveImage } from '$lib/requests';
	import { changesHistory, connect, storyInfo } from '$lib/stores/editing';
	import type { IFrame } from '$lib/types';
	import { Button, InputFile, Photo, Textarea } from '$UI';
	import { Loading } from '$UI/Icons';
	import { Photo as PhotoIcon, XMark } from 'svelte-heros-v2';

	export let data: IFrame;

	let imageLoading = false;
	let avatarId = data.imageId;

	const action = 'storyFrameImageId';

	const preRemoveImage = async () => {
		if (avatarId.includes('base64')) {
			return;
		}

		imageLoading = true;

		const request = await removeImage(
			avatarId,
			action,
			$storyInfo.storyId,
			data.frameId
		);

		if (request.ok) {
			imageLoading = false;
			avatarId = null;

			changesHistory.add({
				title: 'Удаление изображения',
				icon: XMark,
			});
		}
	};

	const preSaveImage = async ([file]: FileList): Promise<void> => {
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
			`&storyId=${$storyInfo.storyId}&frameId=${data.frameId}`
		);

		if (request.ok) {
			const data = await request.json();

			imageLoading = false;
			avatarId = data.imageId;

			changesHistory.add({
				title: 'Добавление изображения',
				icon: PhotoIcon,
			});
		}
	};

	const setFile = (e: InputEvent) => {
		if (e.target instanceof HTMLInputElement) {
			preSaveImage(e.target.files);
		}
	};

	const handleDrop = (e: CustomEvent & InputEvent) => {
		preSaveImage(e.dataTransfer.files);

		$storyInfo.dragImageMode = false;
	};
</script>

<div
	class={className('pointer-events-auto relative flex flex-col gap-2', {
		'childs:invisible': $storyInfo.dragImageMode,
		'!pointer-events-none': $storyInfo.grabbingScale <= 20,
	})}
>
	{#if $storyInfo.dragImageMode}
		<DropArea on:drop={handleDrop}>Перетащите изображение сюда</DropArea>
	{/if}
	{#if avatarId}
		<div>
			{#if !imageLoading && $connect.active}
				<Button class="!absolute z-[2] mr-2 !p-2" on:click={preRemoveImage}>
					<XMark variation={iconsType} class="h-3 w-3 text-red" />
				</Button>
			{/if}
			<div class="relative">
				{#if imageLoading}
					<div
						class="absolute z-[2] flex h-full w-full items-center justify-center rounded-lg bg-black bg-opacity-40"
					>
						<Loading
							variation={iconsType}
							class="bg-transparent text-white"
						/>
					</div>
				{/if}
				<Photo
					class={className('max-h-20 w-full rounded-lg', {
						blind: $connect.active,
					})}
					src={avatarId}
					alt="Иллюстрация текста"
					width={180}
					height={64}
				/>
			</div>
		</div>
	{:else}
		<InputFile
			class="w-full gap-4"
			disabled={$connect.active}
			on:change={setFile}
		>
			<PhotoIcon variation={iconsType} />
			<p>Изображение</p>
		</InputFile>
	{/if}
	<Textarea
		bind:value={data.text}
		placeholder="Текст"
		disabled={$connect.active}
	/>
</div>
