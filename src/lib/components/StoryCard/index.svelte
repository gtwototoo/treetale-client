<script lang="ts">
	import { page } from '$app/state';

	import find from 'lodash/find';
	import { Heart } from 'svelte-heros-v2';
	import { Icon } from 'treetale-ui';

	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { GENRES_LIST } from '$lib/constants/genres';
	import type { Story, User } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';
	import { generateMainColors } from '$lib/utils/customColors';
	import { collapseValue } from '$lib/utils/number';

	import AuthorInfo from '../AuthorInfo/index.svelte';
	import Adventure from '../Icons/Genres/Adventure.svelte';
	import InfoModal from '../InfoModal/index.svelte';

	import Cover from './Cover.svelte';

	const {
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

	let showModal = $state(false);

	let { color, created, genre, imageUrl, likes, status, title } = $derived(story);
	const edit = $derived(page.data.session && page.data.session.userId === author?.userId);
	const icon = $derived(find(GENRES_LIST, { id: genre })?.icon || Adventure);
	const selectedColor = $derived(color || DEFAULT_COLOR);
	const isLiked = $derived(likes?.includes(page.data.session?.userId));
</script>

<InfoModal {story} {author} bind:active={showModal} />
<button class="group relative shrink-0 rounded-2xl" onclick={() => (showModal = true)}>
	<div class="rounded-inherit contents" style={generateMainColors(selectedColor)}>
		<Cover {imageUrl} {title} {icon} color={selectedColor} class={classname} />
		<AuthorInfo
			{author}
			{created}
			{edit}
			{status}
			{selectedColor}
			mobileView
			isButton={false}
			class="bg-main-50 pointer-events-none absolute -top-1 -left-1 z-[1] rounded-full rounded-br-none"
		/>
		<div
			class="bg-main-70 text-text absolute -right-1 -bottom-1 z-[1] flex items-center gap-1 rounded-full rounded-tl-none p-2 pr-4 max-sm:pr-2"
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
	</div>
</button>

<style lang="postcss">
	:global(.animate-card) {
		@apply bg-[0_-100%] from-50% to-100% bg-[length:100%_200%] transition-[background-position,transform];
	}
	:global(.animate-card:hover) {
		@apply bg-[0_-110%];
	}
</style>
