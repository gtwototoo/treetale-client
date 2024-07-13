<script lang="ts">
	import { pluralize } from 'pluralize-ru-ts';

	import type { Frame, Progress, RGB, Story, User } from '$lib/types';

	import { Button, Link, Tag } from 'treetale-ui';

	import { correctVariableReplace } from '$lib/utils/text';
	import Info from './StoryCard/Info.svelte';

	let {
		progress,
		story,
		endFrame,
		selectedColor,
		author
	}: {
		class?: string;
		progress: Progress[];
		story: Story;
		endFrame: Frame;
		selectedColor: RGB;
		author: User;
	} = $props();

	const choicesPluralize = pluralize('выбор', 'выбора', 'выборов');
	const percent = 12;
	const newEnd = true;

	let { created, likes, status, storyId, vars, version } = $derived(story);
</script>

<h1>Результаты</h1>
<div class="flex w-full items-center justify-between">
	<p>
		<span class="font-bold">{progress.length - 1}</span>
		{choicesPluralize(progress.length - 1)}
	</p>
	<Tag class="bg-main">Версия {version}</Tag>
</div>
<div class="flex flex-col gap-4">
	<div class="flex justify-between gap-4">
		<div class="flex gap-2">
			<p>Концовка <span class="font-bold">№{2}</span></p>
			{#if newEnd}
				<Tag class="bg-lime-200">Новая</Tag>
			{/if}
		</div>
		<p>Получило <span class="font-bold">{percent}%</span> читателей</p>
	</div>
	<div class="h-4 w-full overflow-hidden rounded-full bg-main-50">
		<div class="h-full bg-main" style:width="{percent}%"></div>
	</div>
</div>
<p class="line-clamp-3 max-w-sm">
	{@html correctVariableReplace(endFrame.text || 'Без описания', vars)}
</p>
<div class="flex w-full flex-col gap-4">
	<Info {author} {created} edit={false} {likes} {status} {storyId} {selectedColor} />
	<div class="flex gap-6">
		<Link href={`/story/${storyId}`} class="flex-1">
			<Button size="lg" class="w-full justify-center bg-main" {onclick}>В начало</Button>
		</Link>
		<Link href="/" class="flex-1">
			<Button size="lg" class="w-full justify-center bg-main" {onclick}>На главную</Button>
		</Link>
	</div>
</div>
