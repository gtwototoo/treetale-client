<script lang="ts">
	import { onDestroy } from 'svelte';

	import clsx from 'clsx';
	import find from 'lodash/find';
	import { BookOpen, Cloud, PaintBrush, Photo } from 'svelte-heros-v2';

	import type { TGenre } from '$lib/types';

	import { Button, ColorPicker, Contenteditable, FormSplit, Input, InputTags, Popover } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import InvisibleDrop from '$lib/components/InvisibleDrop.svelte';
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
	import { notesHighlight, variablesHighlight } from '$lib/utils';

	import IllustrationPopover from '../../IllustrationPopover.svelte';
	import Panel from '../Panel.svelte';
	import Publishing from './Publishing.svelte';
	import Shortcuts from './Shortcuts.svelte';

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

	const switchGenre = (id: TGenre) => {
		$informationDataStore.genre = id;

		checkUpdates();
	};

	const handleDrop = (e: CustomEvent<Array<File>>) => {
		if (!e.detail.length) {
			return;
		}

		const file = e.detail[0];

		preSaveImage(file);
	};

	const handleDeleteStory = () => deleteStory($informationDataStore.storyId);

	onDestroy(() => {
		if (timer) {
			clearTimeout(timer);
		}
	});

	$: genre = find(GENRES_LIST, { id: $informationDataStore.genre || 'adventure' });
</script>

<Panel nonClose title="Основная информация">
	<InvisibleDrop on:change={handleDrop}>
		<Icon type={BookOpen} variation="solid" class="h-24 w-auto *:fill-gradient" />
		<p>Перетащите сюда изображение, чтобы заменить текущее в блоке</p>
	</InvisibleDrop>
	<div class="flex gap-2 *:min-w-0 *:flex-1">
		<IllustrationPopover imageUrl={$informationDataStore.imageUrl}>
			<ImageUploader
				alt="Иллюстрация истории"
				class="h-48"
				disabled={$panelEditMode}
				icon={BookOpen}
				on:loadstart={setFile}
				on:remove={preRemoveImage}
				readonly={$readonlyStore}
				src={$informationDataStore.imageUrl}
			/>
		</IllustrationPopover>
		<Popover
			align="center"
			disabled={$panelEditMode}
			placeholder="Жанр"
			readonly={$readonlyStore}
		>
			<svelte:fragment slot="button" let:click>
				<Button
					class="w-full flex-col gap-1 bg-contrast-9 !text-text"
					on:click={click}
					size="lg"
					variant="ghost"
				>
					<svelte:component this={genre.icon} class="size-8" />
					<p class="text-xs">{genre.title}</p>
				</Button>
			</svelte:fragment>
			<div class="flex w-96 flex-wrap gap-1 bg-transparent p-2">
				{#each GENRES_LIST as { icon, id, title } (id)}
					<Button
						on:click={() => switchGenre(id)}
						class="min-w-20 flex-1 flex-col gap-1 bg-contrast-9 !text-text"
						size="lg"
						variant="ghost"
					>
						<svelte:component this={icon} class="size-6" />
						<p class="text-xs">{title}</p>
					</Button>
				{/each}
			</div>
		</Popover>
		<ColorPicker
			color={$informationDataStore.color.length ? $informationDataStore.color : DEFAULT_COLOR}
			disabled={$panelEditMode}
			let:click
			{light}
			on:change={setColor}
			align="center"
			readonly={$readonlyStore}
			{saturate}
		>
			<Button
				class="w-full flex-col gap-1 bg-main !text-text"
				on:click={click}
				size="lg"
				variant="ghost"
			>
				<Icon class="size-8" type={PaintBrush} variation="solid" />
				<p class="text-xs">Цвет фона</p>
			</Button>
		</ColorPicker>
	</div>
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
