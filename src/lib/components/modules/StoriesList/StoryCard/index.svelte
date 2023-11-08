<script lang="ts">
	import { BookOpen } from 'svelte-heros-v2';

	import SvgGradient from '../SvgGradient.svelte';

	import Body from './Body.svelte';

	import { Card, Photo } from '$UI';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import Link from '$lib/components/Link.svelte';
	import Tags from '$lib/components/Tags.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import type { IUser, IVariable } from '$lib/types';
	import type { IStoryReading } from '$lib/types/reading';
	import { generateMainColors } from '$lib/utils';

	export let story: IStoryReading;
	export let vars: Array<IVariable>;
	export let edit = false;
	export let author: IUser | undefined = undefined;

	let errorImage = false;

	$: ({ imageId, title, tags, storyId, color, userId } = story);

	$: selectedColor = color.length ? color : DEFAULT_COLOR;
	$: edit = !author && $page.data.session && $page.data.session.userId === userId;
</script>

<Link href={`${storyId}${edit ? '/edit' : ''}`} class="w-full">
	<div
		class="contents"
		style="{generateMainColors(selectedColor)}; --fill-gradient: url(#light-gradient-{storyId})"
	>
		<SvgGradient id={storyId} />
		<Card class="bg-contrast text-text">
			<div
				class="h-56 max-hd:h-48 max-xl:h-40 max-md:h-32 max-sm:h-24 relative flex w-full shrink-0 items-center justify-center bg-transparent text-main"
			>
				{#if imageId && !errorImage}
					<Photo
						on:error={() => (errorImage = true)}
						alt={title || 'Иллюстрация истории'}
						cover
						class="h-full w-full rounded-t-xl xs:rounded-t-2xl"
						src={imageId}
						width={320}
						height={192}
					/>
				{:else}
					<Icon
						type={BookOpen}
						class="h-44 max-hd:h-36 max-xl:h-28 max-md:h-20 w-auto childs:fill-gradient"
						variation="solid"
					/>
				{/if}
			</div>
			<div class="body">
				<Body {story} {vars} {author} />
			</div>
			<div class="p-2 w-full bg-transparent">
				<Tags {tags} />
			</div>
		</Card>
	</div>
</Link>

<style lang="postcss">
	.body {
		@apply relative flex h-full w-full max-w-[12rem] flex-col items-center gap-2 bg-transparent p-3 text-xs xs:max-w-[18rem] xs:gap-4 xs:p-4 lg:max-w-[20rem] lg:gap-6 lg:p-6;
	}
</style>
