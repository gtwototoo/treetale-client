<script lang="ts">
	import { pluralize } from 'pluralize-ru-ts';

	import type { IFrame, IProgress, IUser, IVariable, TRGB } from '$lib/types';
	import type { IStoryFull } from '$lib/types/reading';

	import { Button, Tag } from '$UI';
	import { correctVariableReplace } from '$lib/utils';

	import Link from './Link.svelte';
	import Info from './modules/StoryCard/Info.svelte';

	export let progress: Array<IProgress>;
	export let story: IStoryFull;
	export let endFrame: IFrame;
	export let vars: Array<IVariable>;
	export let selectedColor: TRGB;
	export let author: IUser;

	const choicesPluralize = pluralize('выбор', 'выбора', 'выборов');
	const percent = 12;
	const newEnd = true;

	$: ({ created, likes, status, storyId, vars, version } = story);
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
		<div class="h-full bg-main" style:width="{percent}%" />
	</div>
</div>
<p class="line-clamp-3 max-w-sm">
	{@html correctVariableReplace(endFrame.text, vars)}
</p>
<div class="flex w-full flex-col gap-4">
	<Info {author} {created} edit={false} {likes} {status} {storyId} {selectedColor} />
	<div class="flex gap-6">
		<Link href={`/story/${storyId}`} class="flex-1">
			<Button size="lg" variant="main" class="w-full justify-center !bg-main" on:click>
				В начало
			</Button>
		</Link>
		<Link href="/" class="flex-1">
			<Button size="lg" variant="main" class="w-full justify-center !bg-main" on:click>
				На главную
			</Button>
		</Link>
	</div>
</div>
