<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Likes from '$lib/components/Likes.svelte';
	import ProfileLink from '$lib/components/ProfileLink.svelte';
	import Tags from '$lib/components/Tags.svelte';
	import { infoStore } from '$lib/stores/reading';
	import { correctWhitespace, variableReplace } from '$lib/utils';
	import { Photo, Tag } from '$UI';
	import clsx from 'clsx';
	import { BookOpen } from 'svelte-heros-v2';
	import SvgGradient from '../StoriesList/SvgGradient.svelte';

	$: ({ title, description, imageId, tags, storyId, created } = $infoStore);
</script>

<SvgGradient {storyId} />
<div class="flex flex-col" style="--fill-main: url(#light-gradient-{storyId})">
	<div
		class="relative flex h-24 w-full shrink-0 items-center justify-center bg-transparent text-main xs:h-36 lg:h-48"
		style="--fill-main: url(#light-gradient-{storyId})"
	>
		{#if imageId}
			<Photo
				alt={title || 'Иллюстрация истории'}
				cover
				class="h-full w-full rounded-t-xl xs:rounded-t-2xl"
				src={imageId}
				width={320}
				height={192}
			>
				<svelte:fragment slot="error">
					<Icon
						type={BookOpen}
						class="h-10 w-auto childs:fill-[--fill-main] xs:h-16 lg:h-24"
						variation="solid"
					/>
				</svelte:fragment>
			</Photo>
		{:else}
			<Icon
				type={BookOpen}
				class="h-10 w-auto childs:fill-[--fill-main] xs:h-16 lg:h-24"
				variation="solid"
			/>
		{/if}
	</div>
	<div class="flex flex-col items-stretch gap-4 p-6">
		<Tags {tags} />
		<div class="flex flex-col gap-2 text-center">
			<h1 class="text-2xl">
				{title || 'Без названия'}
			</h1>
			<p
				class={clsx('w-full', description && description.length > 100 ? 'text-lg' : 'text-2xl')}
			>
				{correctWhitespace(variableReplace(description || 'Без описания...', $infoStore.vars))}
			</p>
		</div>
		<div class="flex w-full items-center justify-between gap-1">
			{#if $infoStore.author}
				<ProfileLink data={$infoStore.author} {created} />
			{:else}
				<Tag class="bg-emerald-500 text-emerald-600">Публичный</Tag>
			{/if}
			<Likes info={$infoStore} />
		</div>
	</div>
</div>
