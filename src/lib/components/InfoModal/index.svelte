<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	import find from 'lodash/find';
	import last from 'lodash/last';
	import { Cog6Tooth } from 'svelte-heros-v2';

	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { STORY_FORMATS } from '$lib/constants/formats';
	import { GENRES_LIST } from '$lib/constants/genres';
	import { getProgress } from '$lib/requests/progress';
	import { theme } from '$lib/stores/colors.svelte';
	import { variablesStore } from '$lib/stores/variables.svelte';
	import type { Story, User } from '$lib/types';
	import type { ResponseProgress } from '$lib/types/response';
	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import Modal from '$lib/ui/Modal.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';
	import { generateMainColors } from '$lib/utils/customColors';
	import { formatDate } from '$lib/utils/date';
	import { correctVariableReplace } from '$lib/utils/text';

	import LeftSide from '../LeftSide/index.svelte';
	import VersionTag from '../VersionTag.svelte';

	import ActionButtons from './ActionButtons.svelte';
	import CopyButton from './CopyButton.svelte';
	import SavedProgress from './SavedProgress.svelte';

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

	let progressInfo = $state<ResponseProgress | null>(null);

	const {
		genre: genreId,
		storyId,
		format: formatId,
		tags,
		title,
		version,
		color,
		likes,
		description
	} = $derived(story);
	const edit = $derived(page.data.session && page.data.session.userId === author?.userId);
	const selectedColor = $derived(color || DEFAULT_COLOR);
	const genre = $derived(find(GENRES_LIST, { id: genreId })!);
	const format = $derived(find(STORY_FORMATS, { id: formatId })!);
	const { progress, scopeFrames } = $derived(progressInfo || ({} as ResponseProgress));
	const lastFrame = $derived(
		progress?.choices.length
			? find(scopeFrames, { frameId: last(progress.choices)!.nextFrameId })!
			: scopeFrames?.[0]
	);

	onMount(async () => {
		const { message } = await getProgress(storyId);

		progressInfo = message;
	});
</script>

<Modal
	bind:active
	class="flex w-full max-w-screen-lg flex-row gap-8 p-8 max-md:m-0 max-md:mt-20 max-md:flex-col max-md:items-center max-md:rounded-b-none max-md:p-6"
	customRootStyle={generateMainColors(selectedColor, theme.type)}
>
	<LeftSide {story} {author} {title} />
	<div class="text-text flex h-auto w-full flex-col items-start max-md:items-center">
		<ActionButtons {genre} {storyId} {format} {likes} />
		<div class="flex w-full grow flex-col justify-between gap-14">
			<div class="mt-4 flex flex-col gap-3">
				<h1 class="text-[clamp(32px,5vw,56px)] leading-none max-md:pb-4 max-md:text-center">
					{title || 'Без названия'}
				</h1>
				<div class="flex w-full items-center gap-2">
					{#if edit}
						<Button asLink href="/board/{storyId}" class={clm(button.type.primary, button.size.sm)}>
							<Icon this={Cog6Tooth} class="size-5" />
						</Button>
					{/if}
					<CopyButton {storyId} />
					<VersionTag currentVersion={version} />
					<p class="text-base italic">
						Обновлено {formatDate(story.updated)}
					</p>
				</div>
			</div>
			<div class="flex flex-col gap-4">
				<div class="clear-text adaptive-font px-2 break-words">
					{@html correctVariableReplace(description, variablesStore.variables) || 'Без описания'}
				</div>
				{#if tags.length}
					<div class="flex flex-wrap gap-2 max-md:gap-1">
						{#each tags as tag (tag)}
							<div class="bg-main-300 text-text rounded-full px-4 py-1.5 text-base select-none">
								{tag}
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-sm text-gray-500 max-md:text-xs">Теги не указаны</p>
				{/if}
			</div>
			{#if progress && progress.version !== '0'}
				<SavedProgress {progress} {story} {lastFrame} ondelete={() => (progressInfo = null)} />
			{:else}
				<Button
					asLink
					href="/{storyId}"
					class={clm(button.type.primary, button.size.lg, 'adaptive-font')}
				>
					Начать историю
				</Button>
			{/if}
		</div>
	</div>
</Modal>
