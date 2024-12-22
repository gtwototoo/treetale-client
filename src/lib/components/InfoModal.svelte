<script lang="ts">
	import find from 'lodash/find';
	import { Tag } from 'svelte-heros-v2';
	import { Modal } from 'treetale-ui';

	import { STORY_FORMATS } from '$lib/constants/formats';
	import { GENRES_LIST } from '$lib/constants/genres';
	import { variablesStore } from '$lib/stores/variables.svelte';
	import type { Story, User } from '$lib/types';
	import { formatDate } from '$lib/utils/date';
	import { correctVariableReplace } from '$lib/utils/text';

	import LeftSide from './StoryStage/LeftSide.svelte';
	import ActionButtons from './StoryStage/StoryStart/ActionButtons.svelte';
	import VersionTag from './StoryStage/VersionTag.svelte';

	let {
		active = $bindable(),
		story,
		author
	}: {
		active: boolean;
		story: Story;
		author?: User & {
			subscribersCount: number;
		};
	} = $props();

	const {
		genre: genreId,
		storyId,
		format: formatId,
		tags,
		title,
		version,
		description
	} = $derived(story);
	const genre = $derived(find(GENRES_LIST, { id: genreId })!);
	const format = $derived(find(STORY_FORMATS, { id: formatId })!);
</script>

<Modal bind:active class="w-full max-w-screen-lg p-12">
	<div
		class="flex w-full select-none flex-row items-start gap-2 max-md:flex-col max-md:items-center"
	>
		<LeftSide {story} {author} title={story.title} />
		<div
			class="flex h-auto w-full flex-col items-start gap-6 text-text max-md:items-center xs:px-6"
		>
			<div class="flex w-full flex-col gap-3 max-md:items-center">
				<ActionButtons {genre} {storyId} {format} />
				<h1 class="text-[clamp(32px,5vw,56px)] leading-tight max-md:pb-4 max-md:text-center">
					{title}
				</h1>
				<div class="flex w-full gap-3 max-md:justify-between max-md:px-3">
					<VersionTag currentVersion={version} />
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
		</div>
	</div>
</Modal>
