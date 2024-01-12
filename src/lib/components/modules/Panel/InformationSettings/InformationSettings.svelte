<script lang="ts">
	import { onDestroy } from 'svelte';
	import { BookOpen, Cloud, Photo } from 'svelte-heros-v2';

	import Shortcuts from './Shortcuts.svelte';

	import { Button, ColorPicker, Contenteditable, FormSplit, Input, InputTags, Listbox } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import { DEFAULT_COLOR, GENRES_LIST } from '$lib/constants';
	import { removeImage, saveImage } from '$lib/requests/image';
	import { deleteStory, updateInfomation } from '$lib/requests/story';
	import {
		informationDataStore,
		notesStore,
		readonlyStore,
		variablesStore
	} from '$lib/stores/editing';
	import { changesHistory } from '$lib/stores/history';
	import { currentPanelStore, redColorStore } from '$lib/stores/main';
	import { exclude, notesHighlight, variablesHighlight } from '$lib/utils';
	import clsx from 'clsx';
	import Publishing from './Publishing.svelte';

	let light = 80;
	let saturate = 90;
	let timer: number;
	let saving = false;
	let saveInfo = 'Ожидание изменений';

	const list = exclude(GENRES_LIST, 'id');

	const imageFolder = 'stories';

	const setColor = ({ detail }: CustomEvent) => {
		$informationDataStore.color = detail.color;

		checkUpdates();
	};

	const checkUpdates = () => {
		clearTimeout(timer);
		saving = true;

		timer = window.setTimeout(async () => {
			const { title, tags, color, description, storyId, genre } = $informationDataStore;

			try {
				await updateInfomation(storyId, {
					title,
					tags,
					color,
					description,
					genre
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

	const handleDeleteStory = () => deleteStory($informationDataStore.storyId);

	onDestroy(() => {
		if (timer) {
			clearTimeout(timer);
		}
	});
	$: editMode = $currentPanelStore.editMode;
</script>

<ImageUploader
	class="h-48"
	disabled={editMode}
	readonly={$readonlyStore}
	icon={BookOpen}
	on:loadstart={setFile}
	on:remove={preRemoveImage}
	src={$informationDataStore.imageUrl}
	alt="Иллюстрация текста"
/>
<FormSplit vertical>
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
		pattern={(html) => {
			const varFormattedHtml = variablesHighlight(html, $variablesStore);
			const notesFormattedHtml = notesHighlight(varFormattedHtml, $notesStore);

			return notesFormattedHtml;
		}}
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
<Listbox
	{list}
	placeholder="Жанр"
	readonly={$readonlyStore}
	align="inset"
	value={GENRES_LIST.find(({ id }) => id === $informationDataStore.genre)?.title}
	on:change={({ detail }) => {
		$informationDataStore.genre = GENRES_LIST.find(({ title }) => title === detail).id;
		checkUpdates();
	}}
/>
<FormSplit vertical>
	<ColorPicker
		readonly={$readonlyStore}
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
		on:click={handleDeleteStory}
	>
		Удалить историю
	</Button>
{:else}
	<Publishing />
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
