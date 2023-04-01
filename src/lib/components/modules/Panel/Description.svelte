<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Likes from '$lib/components/Likes.svelte';
	import ProfileLink from '$lib/components/ProfileLink.svelte';
	import Tags from '$lib/components/Tags.svelte';
	import { infoStore } from '$lib/stores/reading';
	import { correctWhitespace, variableReplace } from '$lib/utils';
	import { Photo, Tag } from '$UI';
	import { BookOpen } from 'svelte-heros-v2';
	import SvgGradient from '../StoriesList/SvgGradient.svelte';

	$: date = new Date($infoStore?.created).toLocaleDateString('en-GB');
</script>

{#if $infoStore}
	{@const { title, description, imageId, tags, storyId } = $infoStore}
	<div class="flex flex-col p-4">
		<div
			class="relative flex h-24 w-full shrink-0 items-center justify-center bg-transparent text-main xs:h-36 lg:h-48"
			style="--fill-main: url(#light-gradient-{storyId})"
		>
			<SvgGradient {storyId} />
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
							class="h-10 w-auto childs:fill-[var(--fill-main)] xs:h-16 lg:h-24"
							variation="solid"
						/>
					</svelte:fragment>
				</Photo>
			{:else}
				<Icon
					type={BookOpen}
					class="h-10 w-auto childs:fill-[var(--fill-main)] xs:h-16 lg:h-24"
					variation="solid"
				/>
			{/if}
			<Tags {tags} class="absolute bottom-1 xs:bottom-3 lg:bottom-4" />
		</div>

		<div class="flex flex-col gap-4 text-center text-sm">
			<h1>{title || 'Без названия'}</h1>
			<p class="w-full overflow-hidden text-ellipsis">
				{correctWhitespace(variableReplace(description || 'Без описания...', $infoStore.vars))}
			</p>
			<div class="flex w-full items-center justify-between gap-1">
				{#if $infoStore.author}
					<ProfileLink data={$infoStore.author} classImage="xs:!h-9 xs:!w-9 !h-6 !w-6">
						<div class="overflow-hidden text-left">
							<p class="hidden truncate xs:block">
								{$infoStore.author.name}
							</p>
							<div class="flex select-none gap-1 text-xs text-gray-500">
								<p class="hidden truncate xs:block">Опубликовано</p>
								<p>{date}</p>
							</div>
						</div>
					</ProfileLink>
				{:else}
					<Tag class="bg-emerald-500 text-emerald-600">Публичный</Tag>
				{/if}
				<Likes info={$infoStore} />
			</div>
		</div>
	</div>
{/if}
