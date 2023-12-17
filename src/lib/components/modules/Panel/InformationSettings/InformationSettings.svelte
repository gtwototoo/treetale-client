<script lang="ts">
	import { onDestroy } from 'svelte';
	import { BookOpen, Cloud, Photo, Trash } from 'svelte-heros-v2';

	import Shortcuts from './Shortcuts.svelte';

	import { Button, ColorPicker, Contenteditable, FormSplit, Input, InputTags } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { removeImage, saveImage } from '$lib/requests/image';
	import { deleteStory, updateInfomation } from '$lib/requests/story';
	import { informationDataStore, readonlyStore, variablesStore } from '$lib/stores/editing';
	import { changesHistory } from '$lib/stores/history';
	import { bodyColorStore, currentPanelStore, redColorStore } from '$lib/stores/main';
	import { contrastText, correctWhitespace, variablesHighlight } from '$lib/utils';
	import clsx from 'clsx';

	let light = 80;
	let saturate = 90;
	let timer: number;
	let saving = false;
	let saveInfo = 'Ожидание изменений';

	const imageFolder = 'stories';

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

	const preRemoveImage = async () => {
		if (!$informationDataStore.imageUrl) return;

		try {
			await removeImage(imageFolder, {
				storyId: $informationDataStore.storyId
			});

			$informationDataStore.imageUrl = null;

			changesHistory.add('Удаление изображения истории', Trash);
		} catch (e) {
			console.error(e);
		}
	};

	const preSaveImage = async (file: File): Promise<void> => {
		try {
			const { imageUrl } = await saveImage(file, imageFolder, {
				storyId: $informationDataStore.storyId
			});

			$informationDataStore.imageUrl = imageUrl;

			changesHistory.add('Добавление изображения истории', Photo);
		} catch (e) {
			console.error(e);
		}
	};

	const setFile = (e: CustomEvent<File>) => {
		const file = e.detail;

		preSaveImage(file);
	};

	const switchDraft = () => {
		$informationDataStore.draft = !$informationDataStore.draft;

		checkUpdates();
	};

	const removeStory = () => deleteStory($informationDataStore.storyId);

	onDestroy(() => {
		if (timer) {
			clearTimeout(timer);
		}
	});

	$: warningColor = contrastText($bodyColorStore) ? clsx('bg-orange-950') : clsx('bg-orange-50');
	$: greenColor = contrastText($bodyColorStore)
		? clsx('!bg-emerald-900')
		: clsx('!bg-emerald-200');
	$: editMode = $currentPanelStore.editMode;
</script>

<ImageUploader
	disabled={editMode}
	readonly={$readonlyStore}
	icon={BookOpen}
	on:loadstart={setFile}
	on:remove={preRemoveImage}
	src={$informationDataStore.imageUrl}
	alt="Иллюстрация текста"
/>
<FormSplit vertical class="divide-contrast">
	<Input
		placeholder="Название"
		class="w-full"
		readonly={$readonlyStore}
		bind:value={$informationDataStore.title}
		on:input={checkUpdates}
		disabled={editMode}
	/>
	<Contenteditable
		readonly={$readonlyStore}
		pattern={(html) => variablesHighlight(html, $variablesStore)}
		disabled={editMode}
		placeholder="Описание истории"
		bind:html={$informationDataStore.description}
		on:input={checkUpdates}
	/>
	<InputTags
		disabled={editMode}
		readonly={$readonlyStore}
		placeholder={$informationDataStore.tags.length ? '' : 'Теги'}
		bind:tags={$informationDataStore.tags}
		on:add={checkUpdates}
		on:remove={checkUpdates}
	/>
</FormSplit>
<FormSplit vertical class="divide-contrast">
	<ColorPicker
		popoverAlign="inset"
		lightRange={[15, 80]}
		saturateRange={[10, 90]}
		color={$informationDataStore.color.length ? $informationDataStore.color : DEFAULT_COLOR}
		{saturate}
		{light}
		on:change={setColor}
		disabled={editMode}
	/>
</FormSplit>
{#if editMode}
	<Button
		variant="main"
		class={clsx('justify-center !text-red-500', $redColorStore)}
		on:click={removeStory}
	>
		Удалить историю
	</Button>
{:else if $informationDataStore.draft}
	{#if !$readonlyStore}
		<Button
			variant="main"
			class={clsx('justify-center !text-emerald-500', greenColor)}
			on:click={switchDraft}
		>
			Опубликовать
		</Button>
	{/if}
{:else}
	<div
		class={clsx(
			'flex select-none flex-col gap-4 rounded-lg p-4 text-center text-sm text-orange-500',
			warningColor
		)}
	>
		<p>
			{correctWhitespace(
				'История находится на модерации. Проверка занимает обычно от часа до суток в зависимости от размера созданной или измененной истории.'
			)}
		</p>
		{#if !$readonlyStore}
			<Button
				variant="main"
				class={clsx('justify-center !text-red-500', $redColorStore)}
				on:click={switchDraft}
			>
				Отменить публикацию
			</Button>
		{/if}
	</div>
{/if}
{#if !$readonlyStore}
	<div class="pointer-events-none flex select-none justify-center text-xs text-gray-500">
		{#if saving}
			<Icon type={Cloud} class="h-4 w-4 animate-pulse text-gray-600" />
		{:else}
			{saveInfo}
		{/if}
	</div>
{/if}
<Shortcuts />
