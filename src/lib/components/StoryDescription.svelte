<script lang="ts">
	import { onDestroy } from 'svelte';

	import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';
	import clsx from 'clsx';
	import find from 'lodash/find';
	import last from 'lodash/last';
	import { pluralize } from 'pluralize-ru-ts';
	import { BookOpen, Calendar, Clock, DocumentDuplicate, Trash } from 'svelte-heros-v2';

	import type { IFrame, IProgress, IUser } from '$lib/types';
	import type { IStoryFull } from '$lib/types/reading';

	import { Button, Card, Input, Tag } from '$UI';
	import { DEFAULT_COLOR, GENRES_LIST } from '$lib/constants';
	import { correctVariableReplace } from '$lib/utils';

	import EndResults from './EndResults.svelte';
	import Icon from './Icon.svelte';
	import Link from './Link.svelte';
	import Cover from './StoryCard/Cover.svelte';
	import Info from './StoryCard/Info.svelte';

	export let story: IStoryFull;
	export let author: IUser;
	export let progress: Array<IProgress>;
	export let frames: Array<IFrame>;
	export let storyState: 'begin' | 'ended';

	type ICopyState = 'error' | 'success' | null;

	let state: ICopyState = null;

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

	$: if (state) {
		const timeout = setTimeout(() => {
			state = null;
		}, 500);

		onDestroy(() => {
			clearTimeout(timeout);
		});
	}

	$: ({
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
	} = story);
	$: textForCopy = `${PUBLIC_TREETALE_CLIENT_URL}/${storyId}`;
	$: selectedColor = color.length ? color : DEFAULT_COLOR;
	$: ({ icon, title: genreTitle } = find(GENRES_LIST, { id: genre }));
	$: lastProgressFrame = find(frames, { frameId: last(progress)?.nextFrameId }) as IFrame;
</script>

<div class="flex items-start gap-4">
	{#if imageUrl}
		<Cover {imageUrl} {title} {icon} color={selectedColor} class="sticky top-20" />
	{/if}
	<Card class="h-auto select-none !items-center gap-5 rounded-3xl bg-main-10 p-8 text-text">
		{#if storyState === 'ended'}
			<EndResults
				{story}
				{progress}
				endFrame={lastProgressFrame}
				{vars}
				{selectedColor}
				{author}
			/>
		{:else}
			{#if !imageUrl}
				<Icon
					class="h-44 w-auto *:fill-gradient max-hd:h-36 max-xl:h-28"
					type={BookOpen}
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
						on:click={handleCopyLink}
					>
						<svelte:fragment slot="left">
							<Icon
								type={DocumentDuplicate}
								class={clsx(
									'mx-1.5 size-7 transition-colors',
									state === 'success' && 'text-green-500',
									state === 'error' && 'text-red-500'
								)}
							/>
						</svelte:fragment>
					</Input>
					<Button variant="main" class="!bg-main !p-3" on:click={handleOpenHistory}>
						<Icon type={Clock} class="size-7" />
					</Button>
				</div>
				<p class="max-w-sm">
					{@html correctVariableReplace(description, vars) || 'Без описания'}
				</p>
			</div>
			<div>
				{#each story.tags as tag, index}
					<Link href={`/search?tag=${tag}`}>{tag}</Link>
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
								variant="main"
								class="justify-center !bg-red-500 !p-2"
								on:click={handleDelete}
							>
								<Icon type={Trash} class="size-4" />
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
								<div class="mx-2 size-2 rounded-full bg-yellow-500" />
								<p>Прогресс</p>
							</div>
							<div class="flex items-center gap-2">
								<Icon type={Calendar} class="size-6" />
								<p>{new Date(Date.now()).toLocaleDateString('en-GB')}</p>
							</div>
						</div>
						<Button size="lg" variant="main" class="justify-center !bg-main" on:click>
							Продолжить
						</Button>
					</div>
				</div>
			{:else}
				<Button size="xl" variant="main" class="w-full justify-center !bg-main" on:click>
					Начать историю
				</Button>
			{/if}
		{/if}
	</Card>
</div>
