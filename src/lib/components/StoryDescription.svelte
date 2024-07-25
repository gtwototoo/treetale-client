<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';
	import find from 'lodash/find';
	import last from 'lodash/last';
	import without from 'lodash/without';
	import { pluralize } from 'pluralize-ru-ts';
	import { Calendar, Clock, DocumentDuplicate, Heart, Trash } from 'svelte-heros-v2';
	import { Button, Icon, Tag } from 'treetale-ui';

	import type { Frame, Progress, Story, User } from '$lib/types';

	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { GENRES_LIST } from '$lib/constants/genres';
	import { deleteProgress } from '$lib/requests/progress';
	import { addLike } from '$lib/requests/story';
	import { clm } from '$lib/utils/classMerge';
	import { formatDate } from '$lib/utils/date';
	import { correctVariableReplace } from '$lib/utils/text';

	import Card from './Card.svelte';
	import EndResults from './EndResults.svelte';
	import Cover from './StoryCard/Cover.svelte';
	import Info from './StoryCard/Info.svelte';

	let {
		author,
		frames,
		onclick,
		progress,
		story,
		storyState,
		version
	}: {
		author: {
			subscribersCount: number;
		} & User;
		frames: Frame[];
		onclick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
		progress: Progress[];
		story: Story;
		storyState: 'begin' | 'ended';
		version: string;
	} = $props();

	type CopyState = 'error' | 'success' | null;

	let copyState = $state<CopyState>(null);
	let likeLoading = $state(false);
	let reactiveLikes = $state<number[]>(story.likes);

	const choicesPluralize = pluralize('выбор', 'выбора', 'выборов');
	const likesPluralize = pluralize('лайк', 'лайка', 'лайков');

	const copyText = async (value: string): Promise<boolean> => {
		let success = true;

		try {
			await window.navigator.clipboard.writeText(value);
		} catch (e) {
			console.error(e);

			success = true;
		}

		return success;
	};

	const handleCopyLink = async () => {
		copyState = (await copyText(textForCopy)) ? 'success' : 'error';
	};

	const handleDelete = async () => {
		try {
			await deleteProgress(storyId);

			await invalidateAll();
		} catch (e) {
			console.error(e);
		}
	};

	const handleOpenHistory = () => {
		console.log('open history');
	};

	const versionCompare = (a: string, b: string) => {
		if (a === b) return 'current';

		const aVersion = a.split('.');
		const bVersion = b.split('.');

		if (aVersion[0] === bVersion[0]) return 'minor';

		return 'breaking';
	};

	const switchLike = async () => {
		likeLoading = true;

		try {
			const response = await addLike(storyId);

			if (response.liked) {
				reactiveLikes.push($page.data.session.userId);
			} else {
				reactiveLikes = without(reactiveLikes, $page.data.session.userId);
			}
		} finally {
			likeLoading = false;
		}
	};

	$effect(() => {
		if (copyState) {
			const timeout = setTimeout(() => {
				copyState = null;
			}, 500);

			onDestroy(() => {
				clearTimeout(timeout);
			});
		}
	});

	let {
		color,
		created,
		description,
		genre: genreId,
		imageUrl,
		status,
		storyId,
		tags,
		title,
		vars
	} = $derived(story);
	let textForCopy = $derived(`${PUBLIC_TREETALE_CLIENT_URL}/${storyId}`);
	let selectedColor = $derived(color.length ? color : DEFAULT_COLOR);
	let genre = $derived(find(GENRES_LIST, { id: genreId })!);
	let lastProgressFrame = $derived(
		find(frames, { frameId: last(progress)?.nextFrameId }) as Frame
	);
	let isLiked = $derived(reactiveLikes?.includes($page.data.session?.userId));
</script>

<div class="flex gap-4 max-md:flex-col">
	<Cover
		{imageUrl}
		{title}
		icon={genre.icon}
		color={selectedColor}
		class="self-start max-md:w-full md:sticky md:top-20"
	/>
	<Card class="h-auto min-w-96 max-w-[36rem] select-none gap-5 bg-main-10 p-8 text-text">
		{#if storyState === 'ended'}
			<EndResults
				{story}
				{progress}
				endFrame={lastProgressFrame}
				onclick={() => (storyState = 'begin')}
				{selectedColor}
				{author}
			/>
		{:else}
			<h1 class="pb-3 text-center">{title}</h1>
			<div class="flex h-full flex-col gap-[inherit]">
				<div
					class="flex gap-2 *:flex-1 *:flex-col *:gap-1 *:overflow-hidden *:bg-main-50 hover:*:bg-main-70"
				>
					<Button size="lg">
						<svelte:component this={genre.icon} class="size-8" />
						<p>{genre.title}</p>
					</Button>
					<Button size="lg" onclick={handleCopyLink}>
						<Icon
							this={DocumentDuplicate}
							class={clm(
								'size-8 *:stroke-2',
								copyState === 'success' && 'text-green-500',
								copyState === 'error' && 'text-red-500'
							)}
						/>
						<p>Ссылка</p>
					</Button>
					<Button size="lg" onclick={handleOpenHistory}>
						<Icon this={Clock} class="size-8 *:stroke-2" />
						<p>История</p>
					</Button>
					<Button size="lg" onclick={switchLike} loading={likeLoading}>
						<Icon
							class={clm('size-8 *:stroke-2', isLiked && 'text-red-500')}
							this={Heart}
							variation={isLiked ? 'solid' : 'outline'}
						/>
						<p>{reactiveLikes.length} {likesPluralize(reactiveLikes.length)}</p>
					</Button>
				</div>
				<div class="flex justify-between gap-3">
					<div class="flex flex-col gap-3">
						<div class="clear-text">
							{@html correctVariableReplace(description, vars) || 'Без описания'}
						</div>
						{#if tags.length}
							<div class="flex flex-wrap gap-2 max-md:gap-1">
								{#each tags as tag}
									<Tag class="bg-main text-text">{tag}</Tag>
								{/each}
							</div>
						{:else}
							<p class="text-sm text-gray-500 max-md:text-xs">Теги не указаны</p>
						{/if}
					</div>
					<div class="flex w-48 shrink-0 flex-col gap-4">
						<div class="flex flex-col gap-1">
							<p class="text-sm">Последнее обновление:</p>
							<div class="flex items-center justify-between gap-4">
								<p class="text-sm">{formatDate(Date.now())}</p>
								<Tag class="whitespace-nowrap bg-green-100 text-green-500">
									Версия {story.version}
								</Tag>
							</div>
						</div>
						<div class="flex flex-col gap-1">
							<p class="text-sm">Автор:</p>
							<Info
								{author}
								{created}
								edit={false}
								{status}
								{selectedColor}
								class="w-full"
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="h-px w-full bg-main-50"></div>
			{#if progress.length}
				<div class="flex w-full flex-col gap-3">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<Button
								size="sm"
								class="justify-center !bg-red-500 !p-2"
								onclick={handleDelete}
							>
								<Icon this={Trash} class="size-4" />
							</Button>
							<p>
								<span class="font-bold">{progress.length}</span>
								{choicesPluralize(progress.length)}
							</p>
						</div>
						<Tag
							class={clm(
								{
									breaking: 'bg-red-100 text-red-500',
									current: 'bg-green-100 text-green-500',
									minor: 'bg-yellow-100 text-yellow-500'
								}[versionCompare(story.version, version)]
							)}>Версия {version}</Tag
						>
					</div>
					<p
						class={clm(
							'line-clamp-3 max-w-sm',
							!lastProgressFrame.text?.length && 'text-gray-500'
						)}
					>
						{@html correctVariableReplace(lastProgressFrame.text, vars) || 'Без описания'}
					</p>
					<div class="flex justify-between">
						<div class="flex flex-col gap-1 text-sm">
							<div class="flex items-center gap-2">
								<div class="mx-2 size-2 rounded-full bg-yellow-500"></div>
								<p>Прогресс</p>
							</div>
							<div class="flex items-center gap-2">
								<Icon this={Calendar} class="size-6" />
								<p>{formatDate(Date.now())}</p>
							</div>
						</div>
						<Button size="lg" class="w-48 justify-center bg-main-70 hover:bg-main" {onclick}>
							Продолжить
						</Button>
					</div>
				</div>
			{:else}
				<Button size="xl" class="w-full justify-center bg-main-70 hover:bg-main" {onclick}>
					Начать историю
				</Button>
			{/if}
		{/if}
	</Card>
</div>

<style lang="postcss">
	.clear-text :global(*) {
		font-size: inherit !important;
	}
</style>
