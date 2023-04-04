<script lang="ts">
	import type { IUser, IVariable } from '$lib/types';
	import type { IStoryReading } from '$lib/types/reading';
	import { variableReplace } from '$lib/utils';

	import Likes from '$lib/components/Likes.svelte';
	import ProfileLink from '$lib/components/ProfileLink.svelte';
	import { Tag } from '$UI';
	import clsx from 'clsx';

	export let story: IStoryReading;
	export let vars: IVariable[];
	export let author: IUser | undefined = undefined;

	$: ({ created, description, title, draft } = story);
	$: date = new Date(created).toLocaleDateString('en-GB');
</script>

<div class="line-clamp-6 h-[6.25rem] w-full text-center xs:h-32 lg:h-40">
	<h2 class="mb-1 text-sm/4 xs:mb-3 xs:text-base/5 lg:mb-4 lg:text-xl/6">
		{title || 'Без названия'}
	</h2>
	<p
		class={clsx(
			'whitespace-pre-wrap',
			description && description.length > 100
				? 'text-xs xs:text-sm lg:text-base'
				: 'text-sm leading-4 xs:text-base xs:leading-5 lg:text-xl lg:leading-6'
		)}
	>
		{variableReplace(description, vars) || 'Без описания'}
	</p>
</div>
<div class="flex w-full items-center justify-between gap-1">
	{#if author}
		<ProfileLink data={author} {created} />
	{:else}
		<Tag class={clsx(draft ? 'bg-gray-300 text-gray-600' : 'bg-emerald-300 text-emerald-600')}>
			{draft ? 'Черновик' : 'Публичный'}
		</Tag>
	{/if}
	<Likes info={story} />
</div>
