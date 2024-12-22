<script lang="ts">
	import { page } from '$app/state';

	import find from 'lodash/find';
	import { Cog6Tooth } from 'svelte-heros-v2';
	import { Button, Icon, Modal, Tag } from 'treetale-ui';

	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { STORY_FORMATS } from '$lib/constants/formats';
	import { GENRES_LIST } from '$lib/constants/genres';
	import { variablesStore } from '$lib/stores/variables.svelte';
	import type { Story, User } from '$lib/types';
	import { generateMainColors } from '$lib/utils/customColors';
	import { formatDate } from '$lib/utils/date';
	import { correctVariableReplace } from '$lib/utils/text';

	import LeftSide from './StoryStage/LeftSide.svelte';
	import ActionButtons from './StoryStage/StoryStart/ActionButtons.svelte';
	import CopyButton from './StoryStage/StoryStart/CopyButton.svelte';
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
		color,
		description
	} = $derived(story);
	const edit = $derived(page.data.session && page.data.session.userId === author?.userId);
	const selectedColor = $derived(color.length ? color : DEFAULT_COLOR);
	const genre = $derived(find(GENRES_LIST, { id: genreId })!);
	const format = $derived(find(STORY_FORMATS, { id: formatId })!);
</script>

<Modal
	bind:active
	class="flex w-full max-w-screen-lg flex-row gap-2 bg-main-10 p-12 max-md:flex-col max-md:items-center"
>
	<div style={generateMainColors(selectedColor)} class="contents rounded-inherit">
		<div class="absolute inset-0 -z-[1] rounded-inherit bg-main-10"></div>
		<LeftSide {story} {author} title={story.title} />
		<div class="flex h-auto w-full flex-col items-start text-text max-md:items-center xs:px-6">
			<div class="flex w-full grow flex-col gap-6">
				<div class="flex w-full flex-col gap-3 max-md:items-center">
					<ActionButtons {genre} {storyId} {format} />
					<h1 class="text-[clamp(32px,5vw,56px)] leading-tight max-md:pb-4 max-md:text-center">
						{title}
					</h1>
					<div class="flex w-full gap-3 max-md:justify-between max-md:px-3">
						<VersionTag currentVersion={version} />
						<p class="text-base italic">
							Обновлено {formatDate(story.updated)}
						</p>
					</div>
				</div>
				<div class="flex flex-col gap-4">
					<div class="clear-text adaptive-font break-words px-2">
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
			<div
				class="sticky bottom-0 -mb-6 flex w-full items-center justify-between bg-main-10 py-6"
			>
				{#if false}
					<!-- <SavedProgress
					{progressVersion}
					{updated}
					storyId={story.storyId}
					currentVersion={version}
					choicesCount={choices.length}
					{lastFrame}
					onclick={() => null}
				/> -->
				{:else}
					<div class="flex gap-3">
						<Button
							asLink
							href="/{storyId}"
							size="lg"
							class="adaptive-font pointer-events-auto justify-center bg-main-70 font-medium hover:bg-main"
						>
							Начать историю
						</Button>
						{#if edit}
							<Button
								asLink
								href="/board/{storyId}"
								size="lg"
								class="adaptive-font pointer-events-auto justify-center bg-main-70 font-medium hover:bg-main"
							>
								<Icon this={Cog6Tooth} class="size-6" />
							</Button>
						{/if}
					</div>
					<CopyButton {storyId} />
				{/if}
			</div>
		</div>
	</div>
</Modal>
