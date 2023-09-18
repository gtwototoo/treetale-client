<script lang="ts">
	import type { IUser, IVariable } from '$lib/types';
	import type { IStoryReading } from '$lib/types/reading';
	import { correctVariableReplace } from '$lib/utils';

	import Likes from '$lib/components/Likes.svelte';
	import ProfileLink from '$lib/components/ProfileLink.svelte';
	import { Tag } from '$UI';
	import clsx from 'clsx';

	export let story: IStoryReading;
	export let vars: IVariable[];
	export let author: IUser | undefined = undefined;

	$: ({ storyId, created, description, title, draft, likes } = story);
</script>

<div class="flex h-[6.25rem] items-center xs:h-32 lg:h-40">
	<div class="line-clamp-6 w-full text-center">
		<h2 class="mb-1 text-sm/4 xs:mb-3 xs:text-base/5 lg:mb-4 lg:text-xl/6">
			{title || 'Без названия'}
		</h2>
		<p
			class={clsx(
				'whitespace-pre-wrap',
				description && description.length > 100
					? 'text-xs xs:text-sm lg:text-base'
					: 'text-sm/4 xs:text-base/4 lg:text-xl/6'
			)}
		>
			{correctVariableReplace(description, vars) || 'Без описания'}
		</p>
	</div>
</div>
<div class="flex w-full items-center justify-between gap-4">
	{#if author}
		<ProfileLink data={author} {created} />
	{:else}
		<Tag class={clsx(draft ? 'bg-gray-300 text-gray-600' : 'bg-emerald-300 text-emerald-600')}>
			{draft ? 'Черновик' : 'Публичный'}
		</Tag>
	{/if}
	<Likes {storyId} {likes} />
</div>
