<script lang="ts">
	import { BookOpen } from 'svelte-heros-v2';
	import Icon from './Icon.svelte';

	import type { IUser } from '$lib/types';
	import type { IStoryFull } from '$lib/types/reading';
	import { correctVariableReplace } from '$lib/utils';
	import ReadCard from './ReadCard.svelte';
	import Info from './modules/StoriesList/StoryCard/Info.svelte';

	export let story: IStoryFull;
	export let author: IUser;

	$: ({ title, description, likes, status, created, tags, storyId, vars } = story);
</script>

<ReadCard classCard="h-full text-center !items-center !gap-10">
	<svelte:fragment slot="body">
		<Icon
			type={BookOpen}
			class="h-44 w-auto childs:fill-gradient max-hd:h-36 max-xl:h-28"
			variation="solid"
		/>
		<div class="flex flex-col gap-4">
			<h2 class="uppercase">{title}</h2>
			<p class="max-w-sm">{@html correctVariableReplace(description, vars) || 'Без описания'}</p>
		</div>
		<Info {likes} {author} {status} {created} {tags} {storyId} edit={false} />
	</svelte:fragment>
</ReadCard>
