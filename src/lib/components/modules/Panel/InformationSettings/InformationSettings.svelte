<script lang="ts">
	import { Button, ColorPicker, FormSplit, Input, InputTags } from '$UI';
	import Contenteditable from '$UI/Contenteditable.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Image from '$lib/components/Image.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { removeImage, saveImage } from '$lib/requests/image';
	import { deleteStory, updateInfomation } from '$lib/requests/story';
	import { changesHistory } from '$lib/stores/editing';
	import { currentPanelStore } from '$lib/stores/main';
	import { informationDataStore } from '$lib/stores/newediting';
	import { correctWhitespace } from '$lib/utils';
	import { onDestroy } from 'svelte';
	import { Cloud, Photo as PhotoIcon, XMark } from 'svelte-heros-v2';
	import Shortcuts from './Shortcuts.svelte';

	let light = 80;
	let saturate = 90;
	let timer: number;
	let saving = false;
	let saveInfo = 'Ожидание изменений';
	let state: 'loaded' | 'error' | 'loading' | undefined = undefined;

	const setColor = ({ detail }: CustomEvent) => {
		$informationDataStore.color = detail.color;

		checkUpdates();
	};

	const checkUpdates = () => {
		clearTimeout(timer);
		saving = true;

		timer = window.setTimeout(async () => {
			const { title, tags, color, description, storyId, draft } = $informationDataStore;

			try {
				await updateInfomation(storyId, {
					title,
					tags,
					color,
					description,
					draft
				});

				saveInfo = 'Изменения сохранены';
			} catch {
				saveInfo = 'Ошибка сохранения';
			}

			clearTimeout(timer);
			saving = false;
		}, 3000);
	};

	const action = 'storyImageId';

	const preRemoveImage = async () => {
		if (!$informationDataStore.imageId) return;

		try {
			await removeImage($informationDataStore.imageId, action, $informationDataStore.storyId);

			$informationDataStore.imageId = null;
			state = undefined;

			changesHistory.add('Удаление изображения', XMark);
		} catch (e) {
			console.error(e);
		}
	};

	const preSaveImage = async (file: File): Promise<void> => {
		try {
			const response = await saveImage(
				file,
				action,
				`&storyId=${$informationDataStore.storyId}`
			);

			$informationDataStore.imageId = response.imageId;
			state = undefined;

			changesHistory.add('Добавление изображения', PhotoIcon);
		} catch (e) {
			console.error(e);
		}
	};

	const setFile = (e: CustomEvent<{ file: File }>) => {
		const { file } = e.detail;

		preSaveImage(file);
	};

	const switchDraft = () => {
		$informationDataStore.draft = !$informationDataStore.draft;
		checkUpdates();
	};

	onDestroy(() => {
		if (timer) {
			clearTimeout(timer);
		}
	});
</script>

<Image
	src={$informationDataStore.imageId}
	height={192}
	width={360}
	bind:state
	class="h-48"
	alt="Иллюстрация текста"
	on:loading={setFile}
	on:remove={preRemoveImage}
/>
<FormSplit vertical>
	<Input
		placeholder="Название"
		class="w-full"
		bind:value={$informationDataStore.title}
		on:input={checkUpdates}
		disabled={$currentPanelStore.editMode}
	/>
	<Contenteditable
		disabled={$currentPanelStore.editMode}
		placeholder="Описание"
		bind:html={$informationDataStore.description}
		on:input={checkUpdates}
	/>
	<InputTags
		disabled={$currentPanelStore.editMode}
		placeholder={$informationDataStore.tags.length ? '' : 'Теги'}
		bind:tags={$informationDataStore.tags}
		on:add={checkUpdates}
		on:remove={checkUpdates}
	/>
</FormSplit>
<FormSplit vertical>
	<ColorPicker
		lightRange={[10, 80]}
		saturateRange={[10, 90]}
		color={$informationDataStore.color.length ? $informationDataStore.color : DEFAULT_COLOR}
		{saturate}
		{light}
		on:change={setColor}
		disabled={$currentPanelStore.editMode}
	/>
</FormSplit>
{#if $currentPanelStore.editMode}
	<Button
		variant="main"
		class="justify-center !text-red-500 !bg-red-100"
		on:click={() => deleteStory($informationDataStore.storyId)}
	>
		Удалить историю
	</Button>
{:else if $informationDataStore.draft}
	<Button
		variant="main"
		class="!bg-emerald-200 !text-emerald-500 justify-center"
		on:click={switchDraft}
	>
		Опубликовать
	</Button>
{:else}
	<div
		class="p-4 gap-4 text-sm flex flex-col text-center rounded-lg select-none bg-orange-50 text-orange-500"
	>
		<p>
			{correctWhitespace(
				'История находится на модерации. Проверка занимает обычно от часу до суток в зависимости от размера созданной или измененной истории.'
			)}
		</p>
		<Button
			variant="main"
			class="!text-red-500 !bg-red-100 justify-center"
			on:click={switchDraft}
		>
			Отменить публикацию
		</Button>
	</div>
{/if}
<div class="pointer-events-none flex select-none justify-center text-xs text-gray-500">
	{#if saving}
		<Icon type={Cloud} class="h-4 w-4 animate-pulse text-gray-600" />
	{:else}
		{saveInfo}
	{/if}
</div>
<Shortcuts />
