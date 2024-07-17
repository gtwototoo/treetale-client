<script lang="ts">
	import { onDestroy } from 'svelte';

	import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';
	import find from 'lodash/find';
	import last from 'lodash/last';
	import { pluralize } from 'pluralize-ru-ts';
	import { BookOpen, Calendar, Clock, DocumentDuplicate, Trash } from 'svelte-heros-v2';

	import type { Frame, Progress, Story, User } from '$lib/types';

	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { GENRES_LIST } from '$lib/constants/genres';
	import { clm } from '$lib/utils/classMerge';
	import { correctVariableReplace } from '$lib/utils/text';
	import type { MouseEventHandler } from 'svelte/elements';
	import { Button, Icon, Input, Link, Tag } from 'treetale-ui';
	import Card from './Card.svelte';
	import EndResults from './EndResults.svelte';
	import Cover from './StoryCard/Cover.svelte';
	import Info from './StoryCard/Info.svelte';

	let {
		story,
		author,
		progress,
		frames,
		storyState,
		onclick
	}: {
		story: Story;
		author: User;
		progress: Progress[];
		frames: Frame[];
		storyState: 'begin' | 'ended';
		onclick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
	} = $props();

	type ICopyState = 'error' | 'success' | null;

	let state = $state<ICopyState>(null);

	const choicesPluralize = pluralize('выбор', 'выбора', 'выборов');

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
		state = (await copyText(textForCopy)) ? 'success' : 'error';
	};

	const handleDelete = () => {
		progress = [];
	};

	const handleOpenHistory = () => {
		console.log('open history');
	};

	$effect(() => {
		if (state) {
			const timeout = setTimeout(() => {
				state = null;
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
		genre,
		imageUrl,
		likes,
		status,
		storyId,
		title,
		vars,
		version
	} = $derived(story);
	let textForCopy = $derived(`${PUBLIC_TREETALE_CLIENT_URL}/${storyId}`);
	let selectedColor = $derived(color.length ? color : DEFAULT_COLOR);
	let { icon, title: genreTitle } = $derived(find(GENRES_LIST, { id: genre })!);
	let lastProgressFrame = $derived(
		find(frames, { frameId: last(progress)?.nextFrameId }) as Frame
	);
</script>

<div class="flex items-start gap-4 max-md:flex-col">
	{#if imageUrl}
		<Cover
			{imageUrl}
			{title}
			{icon}
			color={selectedColor}
			class="max-md:w-full md:sticky md:top-20"
		/>
	{/if}
	<Card class="h-auto select-none !items-center gap-5 rounded-3xl bg-main-10 p-8 text-text">
		{#if storyState === 'ended'}
			<EndResults {story} {progress} endFrame={lastProgressFrame} {selectedColor} {author} />
		{:else}
			{#if !imageUrl}
				<Icon
					class="h-44 w-auto *:fill-gradient max-hd:h-36 max-xl:h-28"
					this={BookOpen}
					variation="solid"
				/>
			{/if}
			<div class="flex grow flex-col gap-5">
				<h2 class="pb-3 text-center uppercase">{title}</h2>
				<div class="flex items-center justify-between pl-3">
					<div class="flex items-center gap-3 text-base">
						<svelte:component this={icon} class="size-6" />
						<p>{genreTitle}</p>
					</div>
					<Tag class="bg-main">Версия {version}</Tag>
				</div>
				<div class="flex gap-3">
					<Input
						placeholder="Ссылка"
						readonly
						value={textForCopy}
						class="w-full"
						onclick={handleCopyLink}
					>
						{#snippet left()}
							<Icon
								this={DocumentDuplicate}
								class={clm(
									'mx-1.5 size-7 transition-colors',
									state === 'success' && 'text-green-500',
									state === 'error' && 'text-red-500'
								)}
							/>
						{/snippet}
					</Input>
					<Button class="bg-main-70 p-3 hover:bg-main" onclick={handleOpenHistory}>
						<Icon this={Clock} class="size-7" />
					</Button>
				</div>
				<p class="max-w-sm">
					{@html correctVariableReplace(description, vars) || 'Без описания'}
				</p>
			</div>
			<div>
				{#each story.tags as tag, index}
					<Link href={`/search?tag=${tag}`} data-sveltekit-preload-data="off">{tag}</Link>
					{#if index !== story.tags.length - 1}
						<span class="mx-1">-</span>
					{/if}
				{/each}
			</div>
			<Info {author} {created} edit={false} {likes} {status} {storyId} {selectedColor} />
			{#if progress.length}
				<div class="flex w-full flex-col gap-5 border-t border-main pt-6">
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
								<span class="font-bold">{progress.length - 1}</span>
								{choicesPluralize(progress.length - 1)}
							</p>
						</div>
						<Tag class="bg-main">Версия {version}</Tag>
					</div>
					<p class="line-clamp-3 max-w-sm">
						{@html correctVariableReplace(lastProgressFrame.text, vars)}
					</p>
					<div class="flex justify-between">
						<div class="flex flex-col gap-1">
							<div class="flex items-center gap-2">
								<div class="mx-2 size-2 rounded-full bg-yellow-500"></div>
								<p>Прогресс</p>
							</div>
							<div class="flex items-center gap-2">
								<Icon this={Calendar} class="size-6" />
								<p>{new Date(Date.now()).toLocaleDateString('en-GB')}</p>
							</div>
						</div>
						<Button size="lg" class="justify-center bg-main-70 hover:bg-main" {onclick}>
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
