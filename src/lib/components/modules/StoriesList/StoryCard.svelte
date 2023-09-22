<script lang="ts">
	import { Card, Photo } from '$UI';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import Link from '$lib/components/Link.svelte';
	import Tags from '$lib/components/Tags.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import type { IUser, IVariable } from '$lib/types';
	import type { IStoryReading } from '$lib/types/reading';
	import { BookOpen } from 'svelte-heros-v2';
	import CardBody from './CardBody.svelte';
	import SvgGradient from './SvgGradient.svelte';

	export let story: IStoryReading;
	export let vars: IVariable[];
	export let edit = false;
	export let author: IUser | undefined = undefined;

	let openStoryLoading = false;

	$: ({ imageId, title, tags, storyId, color, userId } = story);

	$: selectedColor = color.length ? color : DEFAULT_COLOR;
	$: edit = !author && $page.data.session && $page.data.session.userId === userId;
</script>

<Link
	href={`${storyId}${edit ? '/edit' : ''}`}
	class="w-full"
	on:click={() => (openStoryLoading = true)}
>
	<Card
		class="h-[19.25rem] border-2 border-transparent bg-with-border-white border-from-white border-to-main xs:h-[27.5rem] lg:h-[34.5rem]"
		style="--color-main: {selectedColor.join(
			' '
		)}; --fill-gradient: url(#light-gradient-{storyId})"
	>
		<SvgGradient id={storyId} />
		<div
			class="relative flex h-24 w-full shrink-0 items-center justify-center bg-transparent text-main xs:h-36 lg:h-48"
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
							class="h-10 w-auto childs:fill-gradient xs:h-16 lg:h-36"
							variation="solid"
						/>
					</svelte:fragment>
				</Photo>
			{:else}
				<Icon
					type={BookOpen}
					class="h-10 w-auto childs:fill-gradient xs:h-16 lg:h-36"
					variation="solid"
				/>
			{/if}
			<Tags {tags} class="absolute bottom-1 xs:bottom-3 lg:bottom-4" />
		</div>
		<div class="body">
			<CardBody {story} {vars} {author} />
		</div>
	</Card>
</Link>

<style lang="postcss">
	.body {
		@apply relative flex h-full w-full max-w-[12rem] flex-col items-center gap-2 bg-transparent p-3 text-xs xs:max-w-[18rem] xs:gap-4 xs:p-4 lg:max-w-[20rem] lg:gap-6 lg:p-6;
	}
</style>
