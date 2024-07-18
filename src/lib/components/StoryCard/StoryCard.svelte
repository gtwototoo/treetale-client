<script lang="ts">
	import { page } from '$app/stores';
	import find from 'lodash/find';
	import { Link } from 'treetale-ui';

	import type { Story, User } from '$lib/types';

	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { GENRES_LIST } from '$lib/constants/genres';
	import { generateMainColors } from '$lib/utils/customColors';

	import Adventure from '../Icons/Genres/Adventure.svelte';
	import Cover from './Cover.svelte';
	import HoverInfo from './HoverInfo.svelte';
	import Info from './Info.svelte';

	let {
		author,
		class: classname,
		story
	}: {
		author?: User;
		class?: string;
		story: Story;
	} = $props();

	let { color, created, description, genre, imageUrl, likes, status, storyId, tags, title, vars } =
		$derived(story);

	let edit = $derived($page.data.session && $page.data.session.userId === author?.userId);
	// let view = $derived(
	// 	$page.data.session &&
	// 		($page.data.session.role === 'admin' || $page.data.session.role === 'moderator')
	// );

	let icon = $derived(find(GENRES_LIST, { id: genre })?.icon || Adventure);
	let selectedColor = $derived(color.length ? color : DEFAULT_COLOR);
</script>

<Link
	href={`${edit ? '/board' : ''}/${storyId}`}
	class="group relative shrink-0 overflow-hidden rounded-3xl"
>
	<div class="contents" style={generateMainColors(selectedColor)}>
		<Cover {imageUrl} {title} {icon} color={selectedColor} class={classname} />
		<Info {author} {created} {edit} {likes} {status} {selectedColor} class="absolute p-2" />
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
