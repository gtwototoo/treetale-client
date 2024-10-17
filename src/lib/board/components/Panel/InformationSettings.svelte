<script lang="ts">
	import { onDestroy } from 'svelte';

	import find from 'lodash/find';
	import { Cloud, PaintBrush } from 'svelte-heros-v2';
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

	import Cover from '$lib/components/StoryCard/Cover.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { STORY_FORMATS } from '$lib/constants/formats';
	import { GENRES_LIST } from '$lib/constants/genres';
	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import type { RGB, StoryFormat } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';

	import { deleteStory, updateInfomation } from '$board/requests/story';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { storyInfoStore } from '$board/stores/info.svelte';
	import { notesStore } from '$board/stores/notes.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';
	import { notesHighlight, variablesHighlight } from '$board/utils/editing';

	import IllustrationEdit from './IllustrationEdit.svelte';
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

			const { color, description, format, genre, storyId, tags, title } = storyInfoStore.info;

			try {
				await updateInfomation(storyId, {
					color,
					description,
					format,
					genre,
					tags,
					title
				});

				saveInfo = 'Изменения сохранены';
			} catch (error) {
				console.error(error);

				saveInfo = 'Ошибка сохранения';
			}

			clearTimeout(timer);
			saving = false;
		}, 3000);
	};

	const switchGenre = (id: string) => {
		if (!storyInfoStore.info) return;

		storyInfoStore.info.genre = id;

		checkUpdates();
	};

	const switchFormat = (id: StoryFormat) => {
		if (!storyInfoStore.info) return;

		storyInfoStore.info.format = id;

		checkUpdates();
	};

	const handleDeleteStory = async () => {
		if (!storyInfoStore.info) return;

		try {
			await deleteStory(storyInfoStore.info.storyId);
		} catch (error) {
			console.error(error);
		}
	};

	const updatePattern = (html: string) => {
		const varFormattedHtml = variablesHighlight(html, variablesStore.variables);
		const notesFormattedHtml = notesHighlight(varFormattedHtml, notesStore.notes);

		return notesFormattedHtml;
	};

	const handleOpenIllustrationPanel = () => {
		panelStatesStore.set('illustration-edit', IllustrationEdit, {
			isEdit: true,
			isSubpanel: true,
			title: 'Настройка иллюстрации'
		});
	};

	onDestroy(() => {
		if (timer) {
			clearTimeout(timer);
		}
	});

	let genre = $derived(find(GENRES_LIST, { id: storyInfoStore.info?.genre || 'adventure' }))!;
	let format = $derived(find(STORY_FORMATS, { id: storyInfoStore.info?.format || 'canvas' }))!;

	let CurrentGenreIcon = $derived(genre.icon);
	let CurrentStoryFormatIcon = $derived(format.icon);
</script>

{#if storyInfoStore.info}
	<div class="flex gap-2">
		<div class="flex w-28 shrink-0 flex-col gap-2 *:h-1/3">
			<Popover align="center" placeholder="Формат" readonly={readonlyModeStore.isEnabled}>
				{#snippet button({ onclick })}
					<Button
						disabled={panelStatesStore.editMode}
						class="size-full flex-col justify-center gap-3 bg-main-20 text-text hover:bg-main-40"
						{onclick}
						size="lg"
					>
						<CurrentStoryFormatIcon class="h-12 w-auto text-main" />
						<p class="text-xs">{format.title}</p>
					</Button>
				{/snippet}
				<div class="flex w-96 flex-wrap gap-1 p-2">
					{#each STORY_FORMATS as { description, icon: FormatIcon, id, title } (id)}
						<Button
							onclick={() => switchFormat(id)}
							class={clm(
								'gap-3 whitespace-normal p-2 hover:bg-main-40',
								id === storyInfoStore.info?.format && 'bg-main-20'
							)}
						>
							<FormatIcon class="h-auto w-24 shrink-0 text-main" />
							<div class="flex flex-col items-start gap-1 text-left">
								<p class="text-base font-medium">{title}</p>
								<p class="text-xs">{description}</p>
							</div>
						</Button>
					{/each}
				</div>
			</Popover>
			<Popover align="center" placeholder="Жанр" readonly={readonlyModeStore.isEnabled}>
				{#snippet button({ onclick })}
					<Button
						disabled={panelStatesStore.editMode}
						class="size-full flex-col justify-center gap-3 bg-main-20 text-text hover:bg-main-40"
						{onclick}
						size="lg"
					>
						<CurrentGenreIcon class="size-10 text-main" />
						<p class="text-xs">{genre.title}</p>
					</Button>
				{/snippet}
				<div class="flex w-96 flex-wrap gap-1 p-2">
					{#each GENRES_LIST as { icon: GenreIcon, id, title } (id)}
						<Button
							onclick={() => switchGenre(id)}
							class={clm(
								'min-w-20 flex-1 flex-col gap-1 text-text hover:bg-main-40',
								id === storyInfoStore.info?.genre && 'bg-main-20'
							)}
						>
							<GenreIcon class="size-7 text-main" />
							<p class="text-xs">{title}</p>
						</Button>
					{/each}
				</div>
			</Popover>
			<ColorPicker
				color={storyInfoStore.info?.color || DEFAULT_COLOR}
				{light}
				onchange={setColor}
				align="center"
				readonly={readonlyModeStore.isEnabled}
				{saturate}
			>
				{#snippet children({ onclick })}
					<Button
						disabled={panelStatesStore.editMode}
						class="size-full flex-col justify-center gap-3 bg-main-20 text-text hover:bg-main-40"
						{onclick}
						size="lg"
					>
						<Icon class="size-10 text-main" this={PaintBrush} variation="solid" />
						<p class="text-xs">Цвет темы</p>
					</Button>
				{/snippet}
			</ColorPicker>
		</div>
		<Button onclick={handleOpenIllustrationPanel} class="p-0">
			<Cover
				imageUrl={storyInfoStore.info.imageUrl}
				title={storyInfoStore.info.title}
				icon={CurrentGenreIcon}
				color={storyInfoStore.info.color}
			/>
		</Button>
	</div>
	<FormSplit vertical>
		<Input
			bind:value={storyInfoStore.info.title}
			class="w-full"
			disabled={panelStatesStore.editMode}
			oninput={checkUpdates}
			maxlength={25}
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
			lowerCase
			maxlength={20}
			maxcount={10}
			onadd={checkUpdates}
			onremove={checkUpdates}
			placeholder={storyInfoStore.info?.tags.length ? '' : 'Теги'}
			readonly={readonlyModeStore.isEnabled}
		/>
	</FormSplit>
	{#if panelStatesStore.editMode}
		<Button
			class={clm('justify-center', redBackgroundColorStore.color)}
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
