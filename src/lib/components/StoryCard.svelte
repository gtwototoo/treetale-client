<script lang="ts">
	import { page } from '$app/stores';
	import find from 'lodash/find';
	import { Heart } from 'svelte-heros-v2';
	import { Icon, Link } from 'treetale-ui';

	import type { Story, User } from '$lib/types';

	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { GENRES_LIST } from '$lib/constants/genres';
	import { clm } from '$lib/utils/classMerge';
	import { generateMainColors } from '$lib/utils/customColors';
	import { collapseValue } from '$lib/utils/number';

	import Adventure from './Icons/Genres/Adventure.svelte';
	import Cover from './StoryCard/Cover.svelte';
	import HoverInfo from './StoryCard/HoverInfo.svelte';
	import Info from './StoryCard/Info.svelte';

	let {
		author,
		class: classname,
		story
	}: {
		author?: {
			subscribersCount: number;
		} & User;
		class?: string;
		story: Story;
	} = $props();

	let { color, created, description, genre, imageUrl, likes, status, storyId, tags, title, vars } =
		$derived(story);

	let edit = $derived($page.data.session && $page.data.session.userId === author?.userId);
	let icon = $derived(find(GENRES_LIST, { id: genre })?.icon || Adventure);
	let selectedColor = $derived(color.length ? color : DEFAULT_COLOR);
	let isLiked = $derived(likes?.includes($page.data.session?.userId));
</script>

<Link href={`${edit ? '/board' : ''}/${storyId}`} class="group relative shrink-0 rounded-2xl">
	<div class="contents rounded-inherit" style={generateMainColors(selectedColor)}>
		<Cover {imageUrl} {title} {icon} color={selectedColor} class={classname} />
		<Info
			{author}
			{created}
			{edit}
			{status}
			{selectedColor}
			mobileView
			class="pointer-events-none absolute -left-1 -top-1 z-[1] rounded-full rounded-br-none bg-main-50"
		/>
		<div
			class="absolute -bottom-1 -right-1 z-[1] flex items-center gap-1 rounded-full rounded-tl-none bg-main-70 p-2 pr-4 text-text max-sm:pr-2"
		>
			<Icon
				class={clm('size-7 max-sm:size-5', isLiked && 'text-red-500')}
				this={Heart}
				variation={isLiked ? 'solid' : 'outline'}
			/>
			<p class="min-w-[1rem] text-center text-xl max-sm:text-base">
				{collapseValue(likes.length)}
			</p>
		</div>
		<HoverInfo {tags} {vars} {description} />
	</div>
</Link>

<style lang="postcss">
	:global(.animate-card) {
		@apply from-50% to-100% bg-[length:100%_200%] bg-[0_-100%] transition-[background-position,transform];
	}
	:global(.animate-card:hover) {
		@apply bg-[0_-110%];
	}
</style>
