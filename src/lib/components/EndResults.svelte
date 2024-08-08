<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	import { pluralize } from 'pluralize-ru-ts';
	import { Button, Link, Tag } from 'treetale-ui';

	import type { Frame, RGB, Story, User } from '$lib/types';

	import Info from './StoryCard/Info.svelte';
	import FrameMini from './StoryDescription/FrameMini.svelte';

	let {
		author,
		choicesCount,
		endFrame,
		onclick,
		selectedColor,
		story
	}: {
		author: {
			subscribersCount: number;
		} & User;
		choicesCount: number;
		class?: string;
		endFrame: Frame;
		onclick: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
		selectedColor: RGB;
		story: Story;
	} = $props();

	const doPluralize = pluralize('Сделан', 'Сделано', 'Сделано');
	const choicesPluralize = pluralize('выбор', 'выбора', 'выборов');
	const percent = 12;
	const newEnd = true;

	let { created, status, version } = $derived(story);
</script>

<h1 class="py-10 text-center">Результаты</h1>
<div class="flex h-full flex-col gap-[inherit]">
	<div class="flex w-full items-center justify-between">
		<p>
			{doPluralize(choicesCount)}
			<span class="font-bold">{choicesCount}</span>
			{choicesPluralize(choicesCount)}
		</p>
		<Tag class="whitespace-nowrap bg-green-100 bg-opacity-30 text-green-500">
			Версия {version}
		</Tag>
	</div>
	<div class="flex flex-col gap-4">
		<div class="flex justify-between gap-4">
			<div class="flex gap-2">
				<p>Концовка <span class="font-bold">№{2}</span></p>
				{#if newEnd}
					<Tag class="bg-green-100 text-green-500">Новая</Tag>
				{/if}
			</div>
			<p>Получило <span class="font-bold">{percent}%</span> читателей</p>
		</div>
		<div class="h-4 w-full overflow-hidden rounded-full bg-main-50">
			<div class="h-full bg-main" style:width="{percent}%"></div>
		</div>
	</div>
	<FrameMini frame={endFrame} />
	<Info {author} {created} edit={false} {status} {selectedColor} />
</div>
<div class="h-px w-full bg-main-50"></div>
<div class="flex gap-6">
	<Button size="lg" class="flex-1 justify-center bg-main-70 hover:bg-main" {onclick}>
		В начало
	</Button>
	<Link href="/" class="flex-1">
		<Button size="lg" class="w-full justify-center bg-main-70 hover:bg-main">На главную</Button>
	</Link>
</div>
