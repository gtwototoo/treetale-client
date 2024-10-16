<script lang="ts">
	import find from 'lodash/find';
	import { Button, Tag } from 'treetale-ui';

	import ActionButtons from './StoryStart/ActionButtons.svelte';
	import CopyButton from './StoryStart/CopyButton.svelte';
	import SavedProgress from './StoryStart/SavedProgress.svelte';
	import VersionTag from './VersionTag.svelte';

	import { STORY_FORMATS } from '$lib/constants/formats';
	import { GENRES_LIST } from '$lib/constants/genres';
	import { variablesStore } from '$lib/stores/variables.svelte';
	import type { Frame, ProgressChoices, Story, User } from '$lib/types';
	import { formatDate } from '$lib/utils/date';
	import { correctVariableReplace } from '$lib/utils/text';

	let {
		currentVersion,
		lastFrame,
		choices,
		progressVersion,
		story,
		started = $bindable(),
		updated
	}: {
		author: {
			subscribersCount: number;
		} & User;
		currentVersion: string;
		lastFrame: Frame;
		choices: ProgressChoices[];
		progressVersion: string;
		story: Story;
		started: boolean;
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
		<VersionTag {currentVersion} />
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
{#if choices.length}
	<SavedProgress
		{progressVersion}
		{updated}
		storyId={story.storyId}
		{currentVersion}
		choicesCount={choices.length}
		{lastFrame}
		onclick={() => (started = true)}
	/>
{:else}
	<div class="flex w-full items-center justify-between">
		<Button
			size="lg"
			class="adaptive-font pointer-events-auto justify-center bg-main-70 font-medium hover:bg-main"
			onclick={() => (started = true)}
		>
			Начать историю
		</Button>
		<CopyButton {storyId} />
	</div>
{/if}
