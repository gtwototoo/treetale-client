<script lang="ts">
	import DropArea from '$lib/components/DropArea.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { removeImage, saveImage } from '$lib/requests';
	import { deleteStory, updateInfo } from '$lib/requests/story';
	import { changesHistory, connect, storyInfo } from '$lib/stores/editing';
	import { mainColor } from '$lib/stores/story';
	import { correctWhitespace } from '$lib/utils';
	import {
		Button,
		ColorPicker,
		Input,
		InputFile,
		InputTags,
		Photo,
		Selector,
		SelectorItem,
		Textarea
	} from '$UI';
	import { Loading } from '$UI/Icons';
	import clsx from 'clsx';
	import { onDestroy } from 'svelte';
	import { Cloud, InformationCircle, Photo as PhotoIcon, Trash, XMark } from 'svelte-heros-v2';

	let light: number = 80;
	let saturate: number = 90;
	let timer: number;
	let saveInfo: string = 'Ожидание изменений';

	const setColor = ({ detail }: CustomEvent) => {
		$mainColor = detail.color;
		$storyInfo.color = detail.color;

		checkUpdates();
	};

	const checkUpdates = () => {
		clearTimeout(timer);

		timer = window.setTimeout(async () => {
			const { title, tags, color, description, storyId, draft } = $storyInfo;
			const { error } = await updateInfo(storyId, {
				title,
				tags,
				color,
				description,
				draft
			});

			saveInfo = error ? 'Ошибка сохранения' : 'Изменения сохранены';
			clearTimeout(timer);
		}, 500);
	};

	let imageLoading = false;
	let tempAvatarURL = '';

	const action = 'storyImageId';

	$: avatar = $storyInfo.imageId || tempAvatarURL;

	const preRemoveImage = async () => {
		if (tempAvatarURL) {
			return;
		}

		imageLoading = true;

		const request = await removeImage($storyInfo.imageId, action, $storyInfo.storyId);

		if (request.ok) {
			imageLoading = false;
			$storyInfo.imageId = null;

			changesHistory.add({
				title: 'Удаление изображения',
				icon: XMark
			});
		}
	};

	const preSaveImage = async ([file]: FileList): Promise<void> => {
		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onloadend = () => {
			tempAvatarURL = reader.result.toString();
		};

		reader.onloadstart = () => {
			imageLoading = true;
		};

		const request = await saveImage(file, action, `&storyId=${$storyInfo.storyId}`);

		if (request.ok) {
			const data = await request.json();

			imageLoading = false;
			tempAvatarURL = '';
			$storyInfo.imageId = data.imageId;

			changesHistory.add({
				title: 'Добавление изображения',
				icon: PhotoIcon
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

	export { styles as class };

	onDestroy(() => {
		if (timer) {
			clearTimeout(timer);
		}
	});
</script>

<div class="flex w-full justify-center">
	<Icon type={InformationCircle} class="h-9 w-9 text-gray-300" />
</div>
<p class="text-center text-sm text-gray-500">
	{correctWhitespace(
		'Тут вы можете прикрепить изображение к своей истории, дать ей название, описание и теги, которые помогут найти ее по определенной тематике'
	)}
</p>
<div class="relative flex flex-col gap-2">
	{#if $storyInfo.dragImageMode}
		<DropArea on:drop={handleDrop}>Перетащите изображение сюда</DropArea>
	{/if}
	{#if avatar}
		<div>
			{#if !imageLoading && $connect.active}
				<Button class="!absolute z-[2] mr-2 !p-2" on:click={preRemoveImage}>
					<Icon type={XMark} class="h-3 w-3 text-red-600" />
				</Button>
			{/if}
			<div class="relative">
				{#if imageLoading}
					<div
						class="absolute z-[2] flex h-full w-full items-center justify-center rounded-lg bg-black bg-opacity-40"
					>
						<Icon type={Loading} class="bg-transparent text-white" />
					</div>
				{/if}
				<Photo
					cover
					class={clsx('max-h-40 w-full rounded-lg', {
						blind: $connect.active
					})}
					src={avatar}
					alt="Иллюстрация текста"
					width={352}
					height={160}
				/>
			</div>
		</div>
	{:else}
		<InputFile class="w-full gap-4" disabled={$connect.active} on:change={setFile}>
			<Icon type={PhotoIcon} />
			<p>Изображение</p>
		</InputFile>
	{/if}
	<div class="flex gap-2">
		<Input
			placeholder="Название"
			class="w-full"
			bind:value={$storyInfo.title}
			on:input={checkUpdates}
		/>
		<ColorPicker
			lightRange={[10, 80]}
			saturateRange={[10, 90]}
			color={$storyInfo.color.length ? $storyInfo.color : DEFAULT_COLOR}
			{saturate}
			{light}
			on:change={setColor}
		/>
	</div>
	<Textarea placeholder="Описание" bind:value={$storyInfo.description} on:input={checkUpdates} />
	<InputTags
		placeholder={$storyInfo.tags.length ? '' : 'Теги'}
		bind:tags={$storyInfo.tags}
		on:add={checkUpdates}
		on:remove={checkUpdates}
	/>
	<Selector on:change={checkUpdates}>
		<SelectorItem
			class="grow justify-center"
			active={$storyInfo.draft}
			on:click={() => {
				$storyInfo.draft = true;
				checkUpdates();
			}}
		>
			Черновик
		</SelectorItem>
		<SelectorItem
			class={clsx('grow justify-center', {
				'!text-green-600': !$storyInfo.draft
			})}
			active={!$storyInfo.draft}
			on:click={() => {
				$storyInfo.draft = false;
				checkUpdates();
			}}
		>
			Публичный
		</SelectorItem>
	</Selector>
	<div class="hl my-4" />
	<Button
		class="justify-center gap-4 !text-red-600"
		on:click={() => deleteStory($storyInfo.storyId)}
	>
		<Icon type={Trash} />
		<p>Удалить историю</p>
	</Button>
</div>
<div class="pointer-events-none flex select-none justify-center text-xs text-gray-500">
	{#if timer}
		<Icon type={Cloud} class="h-4 w-4 animate-pulse text-gray-600" />
	{:else}
		{saveInfo}
	{/if}
</div>
