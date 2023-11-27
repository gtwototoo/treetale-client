<script lang="ts">
	import Body from './Body.svelte';

	import { Card } from '$UI';
	import { page } from '$app/stores';
	import Link from '$lib/components/Link.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import type { IUser, IVariable } from '$lib/types';
	import type { IStoryReading } from '$lib/types/reading';
	import { generateMainColors } from '$lib/utils';
	import Illustration from './Illustration.svelte';
	import Info from './Info.svelte';

	export let story: IStoryReading;
	export let vars: Array<IVariable>;
	export let edit = false;
	export let author: IUser | undefined = undefined;

	$: ({ imageId, title, tags, storyId, color, userId, likes, draft, created, description } =
		story);

	$: selectedColor = color.length ? color : DEFAULT_COLOR;
	$: edit = !author && $page.data.session && $page.data.session.userId === userId;
</script>

<Link href={`${storyId}${edit ? '/edit' : ''}`} class="w-full">
	<div class="contents" style={generateMainColors(selectedColor)}>
		<Card class="select-none bg-contrast bg-gradient-to-b from-main text-text">
			<Illustration {title} {imageId} />
			<div class="body">
				<Body {title} {vars} {description} />
				<Info {draft} {likes} {created} {tags} {author} />
			</div>
		</Card>
	</div>
</Link>

<style lang="postcss">
	.body {
		@apply relative flex h-full w-full flex-col items-center gap-2 bg-transparent p-5 max-lg:p-4 max-sm:p-3 xs:gap-4 lg:gap-6;
	}
</style>
