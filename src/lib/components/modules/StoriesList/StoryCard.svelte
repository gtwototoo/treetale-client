<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import Link from '$lib/components/Link.svelte';
	import Tags from '$lib/components/Tags.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import type { IUser, IVariable } from '$lib/types';
	import type { IStoryReading } from '$lib/types/reading';
	import { contrastText } from '$lib/utils';
	import { Button, Card, Photo } from '$UI';
	import clsx from 'clsx';
	import { BookOpen, Photo as PhotoIcon } from 'svelte-heros-v2';
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

<Card
	class="h-[19.25rem] border-2 border-transparent border-to-main border-from-white bg-with-border-white xs:h-[27.5rem] lg:h-[34.5rem]"
	style="--color-main: {selectedColor.join(' ')}; --fill-main: url(#light-gradient-{storyId})"
>
	<SvgGradient {storyId} />
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
					<Icon type={PhotoIcon} class="h-10 w-auto xs:h-16 lg:h-24" variation="solid" />
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
	<div class="body">
		<CardBody {story} {vars} {author} />
		<div class="cardButtons">
			<Link
				href={`${storyId}${edit ? '/edit' : ''}`}
				class="w-full"
				on:click={() => (openStoryLoading = true)}
			>
				<Button
					variant="main"
					class={clsx(
						'w-full justify-center gap-4 bg-main text-text xs:!px-8 xs:!py-4 xs:!text-xl xs:font-medium',
						contrastText(selectedColor) ? '!text-white' : '!text-black'
					)}
					loading={openStoryLoading}
				>
					{edit ? 'Редактировать' : 'Начать историю'}
				</Button>
			</Link>
		</div>
	</div>
</Card>

<style lang="postcss">
	.body {
		@apply relative flex h-full w-full max-w-[12rem] flex-col items-center gap-2 bg-transparent p-3 text-xs xs:max-w-[18rem] xs:gap-4 xs:p-4 lg:max-w-[20rem] lg:gap-6 lg:p-6;
	}
</style>
