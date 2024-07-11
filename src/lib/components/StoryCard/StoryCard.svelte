<script lang="ts">
	import { page } from '$app/stores';
	import find from 'lodash/find';

	import type { IUser, IVariable } from '$lib/types';
	import type { IStoryReading } from '$lib/types/reading';

	import { DEFAULT_COLOR, GENRES_LIST } from '$lib/constants';
	import { generateMainColors } from '$lib/utils';

	import Link from '../../Link.svelte';
	import Cover from './Cover.svelte';
	import HoverInfo from './HoverInfo.svelte';
	import Info from './Info.svelte';

	let className = '';
	export { className as class };

	export let story: IStoryReading;
	export let author: IUser | undefined = undefined;
	export let vars: Array<IVariable>;

	$: ({ color, created, description, genre, imageUrl, likes, status, storyId, tags, title } =
		story);

	$: edit = $page.data.session && $page.data.session.userId === author?.userId;
	$: view =
		$page.data.session &&
		($page.data.session.role === 'admin' || $page.data.session.role === 'moderator');

	$: icon = find(GENRES_LIST, { id: genre }).icon;
	$: selectedColor = color.length ? color : DEFAULT_COLOR;
</script>

<Link
	href={`/${storyId}${edit ? '/edit' : view ? '/view' : ''}`}
	class="group relative shrink-0 overflow-hidden rounded-3xl"
>
	<div class="contents" style={generateMainColors(selectedColor)}>
		<Cover {imageUrl} {title} {icon} color={selectedColor} class={className} />
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
