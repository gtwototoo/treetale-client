<script lang="ts">
	import Likes from '$lib/components/Likes.svelte';
	import ProfileLink from '$lib/components/ProfileLink.svelte';
	import { infoStore } from '$lib/stores/reading';
	import { correctWhitespace, variableReplace } from '$lib/utils';
	import { Photo, Tag } from '$UI';
	import { BookOpen } from 'svelte-heros-v2';
	import Panel from './Panel.svelte';

	let styles: string = '';
	export { styles as class };

	$: date = new Date($infoStore?.created).toLocaleDateString('en-GB');
</script>

{#if $infoStore}
	{@const { title, description, imageId, tags } = $infoStore}
	<Panel on:click title="Описание" class={styles}>
		{#if imageId}
			<Photo src={imageId} alt={title} class="h-48 w-full" cover width={384} height={192} />
		{:else}
			<div class="flex w-full justify-center">
				<BookOpen
					variation="solid"
					class="h-11 w-11 shrink-0 text-main xs:h-16 xs:w-16 lg:h-24 lg:w-24"
				/>
			</div>
		{/if}

		<div class="flex flex-col gap-4 text-center text-sm">
			<h1>{title || 'Без названия'}</h1>
			<p class="w-full overflow-hidden text-ellipsis">
				{correctWhitespace(variableReplace(description || 'Без описания...', $infoStore.vars))}
			</p>
			{#if tags.length}
				<div class="flex flex-wrap justify-center gap-2">
					{#each tags as tag}
						<p class="tag">{tag}</p>
					{/each}
				</div>
			{/if}
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
	</Panel>
{/if}
