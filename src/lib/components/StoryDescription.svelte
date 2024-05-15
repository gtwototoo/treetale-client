<script lang="ts">
	import { BookOpen } from 'svelte-heros-v2';

	import type { IUser } from '$lib/types';
	import type { IStoryFull } from '$lib/types/reading';

	import { Button } from '$UI';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { correctVariableReplace } from '$lib/utils';

	import Icon from './Icon.svelte';
	import ReadCard from './ReadCard.svelte';
	import Info from './modules/StoryCard/Info.svelte';

	export let story: IStoryFull;
	export let author: IUser;

	$: ({ color, created, description, likes, status, storyId, title, vars } = story);

	$: selectedColor = color.length ? color : DEFAULT_COLOR;
</script>

<ReadCard classCard="h-full text-center !items-center !gap-5">
	<svelte:fragment slot="body">
		<Icon
			class="h-44 w-auto *:fill-gradient max-hd:h-36 max-xl:h-28"
			type={BookOpen}
			variation="solid"
		/>
		<div class="flex flex-col gap-4">
			<h2 class="uppercase">{title}</h2>
			<p class="max-w-sm">{@html correctVariableReplace(description, vars) || 'Без описания'}</p>
		</div>
		<Info {author} {created} edit={false} {likes} {status} {storyId} {selectedColor} />
		<Button size="xl" variant="main" class="w-full justify-center !bg-main" on:click>
			Начать историю
		</Button>
	</svelte:fragment>
</ReadCard>
