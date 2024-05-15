<script lang="ts">
	import { page } from '$app/stores';
	import clsx from 'clsx';
	import find from 'lodash/find';

	import type { IUser, IVariable } from '$lib/types';
	import type { IStoryReading } from '$lib/types/reading';

	import { Image } from '$UI';
	import HoverInfo from '$lib/components/modules/StoryCard/HoverInfo.svelte';
	import { DEFAULT_COLOR, GENRES_LIST } from '$lib/constants';
	import { contrastText, generateMainColors } from '$lib/utils';

	import Link from '../../Link.svelte';
	import Info from './Info.svelte';
	import Titie from './Titie.svelte';
	import TransparentRect from './TransparentRect.svelte';

	let className = '';
	export { className as class };

	export let story: IStoryReading;
	export let author: IUser | undefined = undefined;
	export let vars: Array<IVariable>;

	let errorImage = false;

	const handleError = () => {
		errorImage = true;
	};

	$: ({ color, created, description, genre, imageUrl, likes, status, storyId, tags, title } =
		story);

	$: edit = $page.data.session && $page.data.session.userId === author?.userId;
	$: view =
		$page.data.session &&
		($page.data.session.role === 'admin' || $page.data.session.role === 'moderator');

	$: icon = find(GENRES_LIST, { id: genre }).icon;
	$: selectedColor = color.length ? color : DEFAULT_COLOR;
	$: textColor = contrastText(selectedColor) ? clsx('fill-white') : clsx('fill-black');
	$: gradientColor = contrastText(selectedColor)
		? clsx('from-main to-main-50')
		: clsx('from-main-70 to-main');
	$: iconColor = contrastText(selectedColor) ? clsx('text-main-60') : clsx('text-main');
</script>

<Link href={`/${storyId}${edit ? '/edit' : view ? '/view' : ''}`} class="shrink-0">
	<div class="contents" style={generateMainColors(selectedColor)}>
		<div class={clsx('group relative select-none', className)}>
			<div
				class={clsx(
					'animate-card absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-transparent bg-gradient-to-b',
					gradientColor
				)}
			>
				{#if imageUrl && !errorImage}
					<Image
						alt={title || 'Иллюстрация истории'}
						class="absolute size-full rounded-3xl"
						cover
						on:error={handleError}
						src={imageUrl}
					/>
					<svelte:component
						this={icon}
						class={clsx('absolute right-4 top-4 h-auto w-1/6 opacity-70', iconColor)}
					/>
				{:else}
					<div class="absolute top-0 flex h-1/2 w-full items-center justify-center">
						<svelte:component this={icon} class={clsx('h-1/2 w-auto', iconColor)} />
					</div>
				{/if}
				<Titie {title} {textColor} />
				<Info {author} {created} {edit} {likes} {status} {selectedColor} class="absolute" />
				<HoverInfo {tags} {vars} {description} />
			</div>
			<TransparentRect />
		</div>
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
