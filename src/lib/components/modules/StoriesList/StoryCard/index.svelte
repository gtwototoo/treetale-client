<script lang="ts">
	import Body from './Body.svelte';

	import { Card } from '$UI';
	import { page } from '$app/stores';
	import Link from '$lib/components/Link.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import type { IUser, IVariable } from '$lib/types';
	import type { IStoryReading } from '$lib/types/reading';
	import { generateMainColors } from '$lib/utils';
	import clsx from 'clsx';
	import Illustration from './Illustration.svelte';
	import Info from './Info.svelte';

	let className = '';
	export { className as class };

	export let story: IStoryReading;
	export let vars: Array<IVariable>;
	export let edit = false;
	export let author: IUser | undefined = undefined;

	$: ({ imageUrl, title, tags, storyId, color, userId, likes, draft, created, description } =
		story);

	$: selectedColor = color.length ? color : DEFAULT_COLOR;
	$: edit = $page.data.session && $page.data.session.userId === userId;
</script>

<Link href={`/${storyId}${edit ? '/edit' : ''}`}>
	<div class="contents" style={generateMainColors(selectedColor)}>
		<Card
			class={clsx(
				'animate-card select-none border border-contrast bg-contrast bg-gradient-to-b from-main text-text',
				className
			)}
		>
			<Illustration {title} {imageUrl} />
			<div class="body">
				<Body {title} {vars} {description} />
				<Info {draft} {likes} {created} {tags} {author} {edit} />
			</div>
		</Card>
	</div>
</Link>

<style lang="postcss">
	.body {
		@apply relative flex h-full w-full flex-col items-center gap-2 bg-transparent p-5 max-lg:p-4 max-sm:p-3 xs:gap-4 lg:gap-6;
	}
	:global(.animate-card) {
		@apply from-50% to-100% bg-[length:100%_200%] bg-[0_-100%] transition-[background-position,transform];
	}
	:global(.animate-card:hover) {
		@apply -translate-y-2 bg-[0_-120%];
	}
</style>
