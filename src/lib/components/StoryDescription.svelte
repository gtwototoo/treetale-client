<script lang="ts">
	import { BookOpen } from 'svelte-heros-v2';
	import Icon from './Icon.svelte';

	import type { IStoryFull } from '$lib/types/reading';
	import ReadCard from './ReadCard.svelte';
	import Info from './modules/StoriesList/StoryCard/Info.svelte';

	export let story: IStoryFull;

	$: ({ title, description, likes, author, draft, created, tags, storyId } = story);
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
			<p class="max-w-sm">{description}</p>
		</div>
		<Info {likes} {author} {draft} {created} {tags} {storyId} edit={false} />
	</svelte:fragment>
</ReadCard>
