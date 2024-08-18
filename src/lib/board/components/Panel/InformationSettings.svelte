<script lang="ts">
	import { onDestroy } from 'svelte';

	import { deleteStory, updateInfomation } from '$board/requests/story';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { storyInfoStore } from '$board/stores/info.svelte';
	import { notesStore } from '$board/stores/notes.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';
	import { notesHighlight, variablesHighlight } from '$board/utils/editing';
	import find from 'lodash/find';
	import { Cloud, PaintBrush, Photo } from 'svelte-heros-v2';
	import {
		Button,
		ColorPicker,
		Contenteditable,
		FormSplit,
		Icon,
		Image,
		Input,
		InputTags,
		Popover
	} from 'treetale-ui';

	import type { RGB } from '$lib/types';

	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { GENRES_LIST } from '$lib/constants/genres';
	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';

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

	const switchGenre = (id: string) => {
		if (!storyInfoStore.info) return;

		storyInfoStore.info.genre = id;

		checkUpdates();
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
	let CurrentGenreIcon = $derived(genre.icon);
</script>

{#if storyInfoStore.info}
	<table class="-ml-1 w-[calc(100%+0.5rem)] table-fixed border-separate border-spacing-x-1">
		<tbody>
			<tr>
				<td>
					<Button
						class={clm(
							'w-full flex-col justify-center gap-1 bg-contrast-9 text-text hover:bg-contrast-7',
							storyInfoStore.info?.imageUrl && 'p-1'
						)}
						size="lg"
						onclick={handleOpenIllustrationPanel}
					>
						{#if storyInfoStore.info?.imageUrl}
							<Image
								src={storyInfoStore.info.imageUrl}
								alt="Мини иллюстрация истории"
								cover
								class="flex h-[4.25rem] w-full flex-col rounded-lg"
							>
								{#snippet error()}
									<Icon class="size-8 text-red-500" this={Photo} variation="solid" />
									<p class="text-xs text-red-500">Ошибка</p>
								{/snippet}
							</Image>
						{:else}
							<Icon class="size-8" this={Photo} variation="solid" />
							<p class="text-xs">Иллюстрация</p>
						{/if}
					</Button>
				</td>
				<td>
					<Popover
						align="center"
						disabled={panelStatesStore.editMode}
						placeholder="Жанр"
						readonly={readonlyModeStore.isEnabled}
					>
						{#snippet button({ onclick })}
							<Button
								class="w-full flex-col gap-1 bg-contrast-9 text-text hover:bg-contrast-7"
								{onclick}
								size="lg"
							>
								<CurrentGenreIcon class="size-8" />
								<p class="text-xs">{genre.title}</p>
							</Button>
						{/snippet}
						<div class="flex w-96 flex-wrap gap-1 p-2">
							{#each GENRES_LIST as { icon: GenreIcon, id, title } (id)}
								<Button
									onclick={() => switchGenre(id)}
									class="min-w-20 flex-1 flex-col gap-1 bg-contrast-9 text-text hover:bg-contrast-7"
								>
									<GenreIcon class="size-6" />
									<p class="text-xs">{title}</p>
								</Button>
							{/each}
						</div>
					</Popover>
				</td>
				<td>
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
							<Button
								class="w-full flex-col gap-1 bg-main text-text hover:bg-main-80"
								{onclick}
								size="lg"
							>
								<Icon class="size-8" this={PaintBrush} variation="solid" />
								<p class="text-xs">Цвет темы</p>
							</Button>
						{/snippet}
					</ColorPicker>
				</td>
			</tr>
		</tbody>
	</table>
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
