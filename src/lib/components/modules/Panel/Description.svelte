<script lang="ts">
	import clsx from 'clsx';
	import { BookOpen } from 'svelte-heros-v2';

	import Icon from '$lib/components/Icon.svelte';
	import Likes from '$lib/components/Likes.svelte';
	import ProfileLink from '$lib/components/ProfileLink.svelte';
	import Tags from '$lib/components/Tags.svelte';
	import { storyStore } from '$lib/stores/reading';
	import { correctVariableReplace } from '$lib/utils';
	import { Photo, Tag } from '$UI';

	$: ({ storyId, title, description, imageId, tags, created, likes, vars, author } = $storyStore);
</script>

<div class="flex flex-col">
	<div
		class="relative flex h-48 w-full shrink-0 items-center justify-center rounded-t-xl bg-white text-main"
	>
		{#if imageId}
			<Photo
				alt={title || 'Иллюстрация истории'}
				cover
				class="h-full w-full rounded-t-xl"
				src={imageId}
				width={320}
				height={192}
			>
				<svelte:fragment slot="error">
					<Icon type={BookOpen} class="h-24 w-auto childs:fill-gradient" variation="solid" />
				</svelte:fragment>
			</Photo>
		{:else}
			<Icon type={BookOpen} class="h-24 w-auto childs:fill-gradient" variation="solid" />
		{/if}
	</div>
	<div class="flex flex-col items-stretch gap-4 p-3">
		<Tags {tags} />
		<div class="flex flex-col gap-2 text-center">
			<h1 class="text-2xl">
				{title || 'Без названия'}
			</h1>
			<p
				class={clsx('w-full', description && description.length > 100 ? 'text-lg' : 'text-2xl')}
			>
				{correctVariableReplace(description, vars) || 'Без описания'}
			</p>
		</div>
		<div class="flex w-full items-center justify-between gap-1">
			{#if author}
				<ProfileLink data={author} {created} />
			{:else}
				<Tag class="bg-emerald-500 text-emerald-600">Публичный</Tag>
			{/if}
			<Likes {storyId} {likes} />
		</div>
	</div>
</div>
