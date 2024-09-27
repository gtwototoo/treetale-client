<script lang="ts">
	import find from 'lodash/find';
	import { Button, Tag } from 'treetale-ui';

	import type { Frame, Progress, Story, User } from '$lib/types';

	import { STORY_FORMATS } from '$lib/constants/formats';
	import { GENRES_LIST } from '$lib/constants/genres';
	import { variablesStore } from '$lib/stores/variables.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { formatDate } from '$lib/utils/date';
	import { correctVariableReplace } from '$lib/utils/text';

	import ActionButtons from './StoryStart/ActionButtons.svelte';
	import CopyButton from './StoryStart/CopyButton.svelte';
	import SavedProgress from './StoryStart/SavedProgress.svelte';

	let {
		currentVersion,
		lastFrame,
		progress,
		progressVersion,
		story,
		storyState = $bindable(),
		updated
	}: {
		author: {
			subscribersCount: number;
		} & User;
		currentVersion: string;
		lastFrame: Frame;
		progress: Progress[];
		progressVersion: string;
		story: Story;
		storyState: 'begin' | 'ended' | 'started';
		updated: number;
	} = $props();

	let { description, format: formatId, genre: genreId, storyId, tags, title } = $derived(story);
	let genre = $derived(find(GENRES_LIST, { id: genreId })!);
	let format = $derived(find(STORY_FORMATS, { id: formatId })!);
</script>

<div class="flex w-full flex-col gap-3 max-md:items-center">
	<ActionButtons {genre} {storyId} {format} />
	<h1 class="text-[clamp(32px,5vw,56px)] leading-tight max-md:pb-4 max-md:text-center">
		{title}
	</h1>
	<div class="flex w-full gap-3 max-md:justify-between max-md:px-3">
		<Tag
			class={clm(
				'whitespace-nowrap bg-opacity-30',
				currentVersion === 'Архив' ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-500'
			)}
		>
			{currentVersion === 'Архив' ? currentVersion : `Версия ${currentVersion}`}
		</Tag>
		<p class="text-base italic">
			Обновлено <span class="font-medium">{formatDate(story.updated)}</span>
		</p>
	</div>
</div>
<div class="flex flex-col gap-3">
	<div class="clear-text adaptive-font px-2">
		{@html correctVariableReplace(description, variablesStore.variables) || 'Без описания'}
	</div>
	{#if tags.length}
		<div class="flex flex-wrap gap-2 max-md:gap-1">
			{#each tags as tag}
				<Tag class="rounded-full bg-main-40 px-4 text-base text-text">{tag}</Tag>
			{/each}
		</div>
	{:else}
		<p class="text-sm text-gray-500 max-md:text-xs">Теги не указаны</p>
	{/if}
</div>
{#if progress.length}
	<SavedProgress
		{progressVersion}
		{updated}
		storyId={story.storyId}
		{currentVersion}
		choicesCount={progress.length}
		{lastFrame}
		onclick={() => (storyState = 'started')}
	/>
{:else}
	<div class="flex w-full items-center justify-between">
		<Button
			size="lg"
			class="adaptive-font pointer-events-auto justify-center bg-main-70 font-medium hover:bg-main"
			onclick={() => (storyState = 'started')}
		>
			Начать историю
		</Button>
		<CopyButton {storyId} />
	</div>
{/if}
