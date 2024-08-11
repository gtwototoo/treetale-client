<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	import find from 'lodash/find';
	import last from 'lodash/last';
	import { Button, Tag } from 'treetale-ui';

	import type { Frame, Progress, Story, User } from '$lib/types';

	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { GENRES_LIST } from '$lib/constants/genres';
	import { variablesStore } from '$lib/stores/variables.svelte';
	import { formatDate } from '$lib/utils/date';
	import { correctVariableReplace } from '$lib/utils/text';

	import EndResults from './EndResults.svelte';
	import Likes from './Likes.svelte';
	import Cover from './StoryCard/Cover.svelte';
	import Info from './StoryCard/Info.svelte';
	import ActionButtons from './StoryDescription/ActionButtons.svelte';
	import SavedProgress from './StoryDescription/SavedProgress.svelte';

	let {
		author,
		frames,
		onclick,
		progress,
		story,
		storyState,
		updated,
		version
	}: {
		author: {
			subscribersCount: number;
		} & User;
		frames: Frame[];
		onclick: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
		progress: Progress[];
		story: Story;
		storyState: 'begin' | 'ended';
		updated: number;
		version: string;
	} = $props();

	let {
		color,
		created,
		description,
		genre: genreId,
		imageUrl,
		likes,
		status,
		storyId,
		tags,
		title
	} = $derived(story);
	let selectedColor = $derived(color.length ? color : DEFAULT_COLOR);
	let genre = $derived(find(GENRES_LIST, { id: genreId })!);
	let lastProgressFrame = $derived(
		find(frames, { frameId: last(progress)?.nextFrameId }) as Frame
	);
</script>

<div class="flex w-full max-w-screen-lg select-none flex-row gap-8">
	<div class="flex w-1/3 shrink-0 flex-col gap-3">
		<div class="flex gap-2">
			<Info
				{author}
				{created}
				edit={false}
				{status}
				{selectedColor}
				class="grow bg-main-50 hover:bg-main-70"
			/>
			<Likes {likes} {storyId} class="rounded-full pr-4" />
		</div>
		<Cover
			{imageUrl}
			{title}
			icon={genre.icon}
			color={selectedColor}
			class="w-auto shrink-0 self-start max-md:w-full md:sticky md:top-20"
		/>
	</div>
	<div class="flex h-auto w-full flex-col items-start gap-6 text-text">
		{#if storyState === 'ended'}
			<EndResults
				{story}
				choicesCount={progress.length}
				endFrame={lastProgressFrame}
				onclick={() => (storyState = 'begin')}
				storyVersion={story.version}
			/>
		{:else}
			<div class="flex flex-col gap-3">
				<ActionButtons {genre} {storyId} />
				<h1>{title}</h1>
				<div class="flex gap-3">
					<Tag class="whitespace-nowrap bg-green-100 bg-opacity-30 text-green-500">
						Версия {story.version}
					</Tag>
					<p class="text-base italic">
						Обновлено <span class="font-medium">{formatDate(story.updated)}</span>
					</p>
				</div>
			</div>
			<div class="flex flex-col gap-3">
				<div class="clear-text adaptive-font px-2">
					{@html correctVariableReplace(description, variablesStore.variables) ||
						'Без описания'}
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
					{version}
					{updated}
					storyId={story.storyId}
					storyVersion={story.version}
					choicesCount={progress.length}
					lastFrame={lastProgressFrame}
					{onclick}
				/>
			{:else}
				<Button size="lg" class="adaptive-font bg-main-70 font-medium hover:bg-main" {onclick}>
					Начать историю
				</Button>
			{/if}
		{/if}
	</div>
</div>

<style lang="postcss">
	.clear-text :global(*) {
		font-size: inherit !important;
	}
</style>
