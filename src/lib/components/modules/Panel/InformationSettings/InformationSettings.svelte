<script lang="ts">
	import { onDestroy } from 'svelte';

	import clsx from 'clsx';
	import { BookOpen, Cloud, Photo } from 'svelte-heros-v2';

	import { Button, ColorPicker, Contenteditable, FormSplit, Input, InputTags, Listbox } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import { DEFAULT_COLOR, GENRES_LIST } from '$lib/constants';
	import { removeImage, saveImage } from '$lib/requests/files';
	import { deleteStory, updateInfomation } from '$lib/requests/story';
	import {
		informationDataStore,
		notesStore,
		readonlyStore,
		variablesStore
	} from '$lib/stores/editing';
	import { changesHistory } from '$lib/stores/history';
	import { redColorStore } from '$lib/stores/main';
	import { panelEditMode } from '$lib/stores/panel';
	import { exclude, notesHighlight, variablesHighlight } from '$lib/utils';

	import Panel from '../Panel.svelte';
	import Publishing from './Publishing.svelte';
	import Shortcuts from './Shortcuts.svelte';

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
			const { color, description, genre, storyId, tags, title } = $informationDataStore;

			try {
				await updateInfomation(storyId, {
					color,
					description,
					genre,
					tags,
					title
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
			const { fileUrl } = await saveImage(file, imageFolder, {
				storyId: $informationDataStore.storyId
			});

			$informationDataStore.imageUrl = fileUrl;

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
</script>

<Panel nonClose title="Основная информация">
	<ImageUploader
		alt="Иллюстрация текста"
		class="h-48"
		disabled={$panelEditMode}
		icon={BookOpen}
		on:loadstart={setFile}
		on:remove={preRemoveImage}
		readonly={$readonlyStore}
		src={$informationDataStore.imageUrl}
	/>
	<FormSplit vertical>
		<Input
			bind:value={$informationDataStore.title}
			class="w-full"
			disabled={$panelEditMode}
			on:input={checkUpdates}
			placeholder="Название"
			readonly={$readonlyStore}
		/>
		<Contenteditable
			bind:html={$informationDataStore.description}
			disabled={$panelEditMode}
			on:input={checkUpdates}
			pattern={(html) => {
				const varFormattedHtml = variablesHighlight(html, $variablesStore);
				const notesFormattedHtml = notesHighlight(varFormattedHtml, $notesStore);

				return notesFormattedHtml;
			}}
			placeholder="Описание истории"
			readonly={$readonlyStore}
		/>
		<InputTags
			bind:tags={$informationDataStore.tags}
			disabled={$panelEditMode}
			on:add={checkUpdates}
			on:remove={checkUpdates}
			placeholder={$informationDataStore.tags.length ? '' : 'Теги'}
			readonly={$readonlyStore}
		/>
	</FormSplit>
	<Listbox
		align="inset"
		disabled={$panelEditMode}
		{list}
		on:change={({ detail }) => {
			$informationDataStore.genre = GENRES_LIST.find(({ title }) => title === detail).id;
			checkUpdates();
		}}
		placeholder="Жанр"
		readonly={$readonlyStore}
		value={GENRES_LIST.find(({ id }) => id === $informationDataStore.genre)?.title}
	/>
	<FormSplit vertical>
		<ColorPicker
			color={$informationDataStore.color.length ? $informationDataStore.color : DEFAULT_COLOR}
			disabled={$panelEditMode}
			{light}
			lightRange={[15, 80]}
			on:change={setColor}
			popoverAlign="inset"
			readonly={$readonlyStore}
			{saturate}
			saturateRange={[10, 90]}
		/>
	</FormSplit>
	{#if $panelEditMode}
		<Button
			class={clsx('justify-center !text-red-500', $redColorStore)}
			on:click={handleDeleteStory}
			variant="main"
		>
			Удалить историю
		</Button>
	{:else}
		<Publishing />
	{/if}
	{#if !$readonlyStore}
		<div class="pointer-events-none flex select-none justify-center text-xs text-gray-500">
			{#if saving}
				<Icon class="size-4 animate-pulse text-gray-600" type={Cloud} />
			{:else}
				{saveInfo}
			{/if}
		</div>
	{/if}
	<Shortcuts />
</Panel>
