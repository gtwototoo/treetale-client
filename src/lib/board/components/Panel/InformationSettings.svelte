<script lang="ts">
	import { onDestroy } from 'svelte';

	import ImageUploader from '$board/components/ImageUploader.svelte';
	import { deleteStory, updateInfomation } from '$board/requests/story';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { storyInfoStore } from '$board/stores/info.svelte';
	import { notesStore } from '$board/stores/notes.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';
	import { notesHighlight, variablesHighlight } from '$board/utils/editing';
	import find from 'lodash/find';
	import { BookOpen, Cloud, PaintBrush, Photo } from 'svelte-heros-v2';
	import {
		Button,
		ColorPicker,
		Contenteditable,
		FormSplit,
		Icon,
		Input,
		InputTags,
		Popover
	} from 'treetale-ui';

	import type { Genre, RGB } from '$lib/types';

	import InvisibleDrop from '$lib/components/InvisibleDrop.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { GENRES_LIST } from '$lib/constants/genres';
	import { ILLUSTRATIONS_FOLDER } from '$lib/constants/s3forders';
	import { removeImage, saveImage } from '$lib/requests/files';
	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';

	import IllustrationPopover from './IllustrationPopover.svelte';
	import Publishing from './InformationSettings/Publishing.svelte';
	import Shortcuts from './InformationSettings/Shortcuts.svelte';

	let light = $state(80);
	let saturate = $state(90);
	let timer = $state<number>();
	let saving = $state(false);
	let saveInfo = $state('Ожидание изменений');

	const setColor = (color: RGB) => {
		if (!storyInfoStore.info) return;

		storyInfoStore.info.color = color;

		checkUpdates();
	};

	const checkUpdates = () => {
		clearTimeout(timer);
		saving = true;

		timer = window.setTimeout(async () => {
			if (!storyInfoStore.info) {
				return;
			}

			const { color, description, genre, storyId, tags, title } = storyInfoStore.info;

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
		if (!storyInfoStore.info || !storyInfoStore.info.imageUrl) return;

		try {
			await removeImage(ILLUSTRATIONS_FOLDER, {
				storyId: storyInfoStore.info.storyId
			});

			storyInfoStore.info.imageUrl = null;
		} catch (e) {
			console.error(e);
		}
	};

	const preSaveImage = async (file: File): Promise<void> => {
		if (!storyInfoStore.info) return;

		try {
			const { fileUrl } = await saveImage(file, ILLUSTRATIONS_FOLDER, {
				storyId: storyInfoStore.info.storyId
			});

			storyInfoStore.info.imageUrl = fileUrl;

			changesHistoryStore.add('Добавление изображения истории', Photo);
		} catch (e) {
			console.error(e);
		}
	};

	const setFile = (file: File) => {
		preSaveImage(file);
	};

	const switchGenre = (id: Genre) => {
		if (!storyInfoStore.info) return;

		storyInfoStore.info.genre = id;

		checkUpdates();
	};

	const handleDrop = (files: File[]) => {
		const file = files[0];

		preSaveImage(file);
	};

	const handleDeleteStory = () => {
		if (!storyInfoStore.info) return;

		deleteStory(storyInfoStore.info.storyId);
	};

	const updatePattern = (html: string) => {
		const varFormattedHtml = variablesHighlight(html, variablesStore.variables);
		const notesFormattedHtml = notesHighlight(varFormattedHtml, notesStore.notes);

		return notesFormattedHtml;
	};

	onDestroy(() => {
		if (timer) {
			clearTimeout(timer);
		}
	});

	let genre = $derived(find(GENRES_LIST, { id: storyInfoStore.info?.genre || 'adventure' }));
</script>

{#if storyInfoStore.info}
	<InvisibleDrop onchange={handleDrop}>
		<Icon this={BookOpen} variation="solid" class="h-24 w-auto *:fill-gradient" />
		<p>Перетащите сюда изображение, чтобы заменить текущее в блоке</p>
	</InvisibleDrop>
	<div class="flex gap-2 *:min-w-0 *:flex-1">
		<IllustrationPopover imageUrl={storyInfoStore.info.imageUrl}>
			<ImageUploader
				alt="Иллюстрация истории"
				class="h-48"
				disabled={panelStatesStore.editMode}
				icon={BookOpen}
				onloadstart={setFile}
				onremove={preRemoveImage}
				readonly={readonlyModeStore.isEnabled}
				src={storyInfoStore.info?.imageUrl}
			/>
		</IllustrationPopover>
		<Popover
			align="center"
			disabled={panelStatesStore.editMode}
			placeholder="Жанр"
			readonly={readonlyModeStore.isEnabled}
		>
			{#snippet button({ onclick })}
				<Button class="w-full flex-col gap-1 bg-contrast-9 text-text" {onclick} size="lg">
					<svelte:component this={genre?.icon} class="size-8" />
					<p class="text-xs">{genre?.title}</p>
				</Button>
			{/snippet}
			<div class="flex w-96 flex-wrap gap-1 p-2">
				{#each GENRES_LIST as { icon, id, title } (id)}
					<Button
						onclick={() => switchGenre(id)}
						class="min-w-20 flex-1 flex-col gap-1 bg-contrast-9 text-text"
					>
						<svelte:component this={icon} class="size-6" />
						<p class="text-xs">{title}</p>
					</Button>
				{/each}
			</div>
		</Popover>
		<ColorPicker
			color={storyInfoStore.info?.color || DEFAULT_COLOR}
			disabled={panelStatesStore.editMode}
			{light}
			onchange={setColor}
			align="center"
			readonly={readonlyModeStore.isEnabled}
			{saturate}
		>
			{#snippet children({ onclick })}
				<Button class="w-full flex-col gap-1 bg-main text-text" {onclick} size="lg">
					<Icon class="size-8" this={PaintBrush} variation="solid" />
					<p class="text-xs">Цвет фона</p>
				</Button>
			{/snippet}
		</ColorPicker>
	</div>
	<FormSplit vertical>
		<Input
			bind:value={storyInfoStore.info.title}
			class="w-full"
			disabled={panelStatesStore.editMode}
			oninput={checkUpdates}
			placeholder="Название"
			readonly={readonlyModeStore.isEnabled}
		/>
		<Contenteditable
			bind:html={storyInfoStore.info.description}
			disabled={panelStatesStore.editMode}
			oninput={checkUpdates}
			pattern={updatePattern}
			placeholder="Описание истории"
			readonly={readonlyModeStore.isEnabled}
		/>
		<InputTags
			bind:tags={storyInfoStore.info.tags}
			disabled={panelStatesStore.editMode}
			onadd={checkUpdates}
			onremove={checkUpdates}
			placeholder={storyInfoStore.info?.tags.length ? '' : 'Теги'}
			readonly={readonlyModeStore.isEnabled}
		/>
	</FormSplit>
	{#if panelStatesStore.editMode}
		<Button
			class={clm('justify-center !text-red-500', redBackgroundColorStore.color)}
			onclick={handleDeleteStory}
		>
			Удалить историю
		</Button>
	{:else}
		<Publishing />
	{/if}
	{#if !readonlyModeStore.isEnabled}
		<div class="pointer-events-none flex select-none justify-center text-xs text-gray-500">
			{#if saving}
				<Icon class="size-4 animate-pulse text-gray-600" this={Cloud} />
			{:else}
				{saveInfo}
			{/if}
		</div>
	{/if}
	<Shortcuts />
{/if}
