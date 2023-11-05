<script lang="ts">
	import clsx from 'clsx';
	import { BookOpen } from 'svelte-heros-v2';

	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Frame from '$lib/components/Frame.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Likes from '$lib/components/Likes.svelte';
	import SvgGradient from '$lib/components/modules/StoriesList/SvgGradient.svelte';
	import ProfileLink from '$lib/components/ProfileLink.svelte';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { updateProgress } from '$lib/requests/progress';
	import { bodyColorStore } from '$lib/stores/main.js';
	import { framesStore } from '$lib/stores/reading.js';
	import { last, rootStyle } from '$lib/utils';
	import Tag from '$UI/Tag.svelte';

	export let data;

	let current = data.progress.length - 1;
	let translate = 0;

	const handleKeydown = (e: KeyboardEvent) => {
		const { code } = e;

		const prevFrame = () => {
			if (current >= 1) current -= 1;
		};

		const nextFrame = () => {
			if (current < data.progress.length - 1) current += 1;
		};

		const nextZeroChoicesFrame = () => {
			const lastFrame = last(data.frames);

			if (lastFrame?.choices && lastFrame?.choices.length === 1) {
				setChoice(lastFrame.frameId, lastFrame.choices[0].choiceId);
			}
		};

		const actions: Record<string, () => void> = {
			ArrowUp: prevFrame,
			ArrowDown: nextFrame,
			Space: nextZeroChoicesFrame
		};

		if (!(code in actions)) return;

		e.preventDefault();

		actions[code]();
	};

	const setChoice = async (frameId: number, choiceId: number) => {
		if (!$page.data.session) {
			goto('/signin');
		}

		try {
			await updateProgress(storyId, frameId, choiceId);
			invalidateAll();

			current = data.progress.length;
		} catch (e) {
			console.error(e);
		}
	};

	$framesStore = data.frames;

	const setPosition = (node: HTMLDivElement, current: number) => {
		const changePosition = (current: number) => {
			const childs = Array.from(node.childNodes).filter(
				(element) => element instanceof HTMLElement
			) as Array<HTMLElement>;

			const centerOffset =
				node.scrollHeight - (childs[current].offsetTop + childs[current].clientHeight / 2);
			const translate = node.scrollHeight / 2 - centerOffset;

			node.style.transform = `translateY(${-translate}px)`;
		};

		changePosition(current);

		return {
			update(current: number) {
				changePosition(current);
			}
		};
	};

	$: ({ storyId, title, description, author, created, draft, likes, color } = data.story);
	$: $bodyColorStore = color;
	$: $framesStore = data.frames;
</script>

<svelte:head>
	<title>{title}</title>
	{@html rootStyle($bodyColorStore, {
		'fill-gradient': `url(#light-gradient-${storyId})`
	})}
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<SvgGradient id={storyId} />

<div class="flex w-full justify-center px-4 h-screen items-center overflow-hidden">
	<div class="flex flex-col gap-6 transition-transform" use:setPosition={current}>
		<ReadCard classCard="h-full">
			<svelte:fragment slot="body">
				<Icon
					type={BookOpen}
					class="h-44 max-hd:h-36 max-xl:h-28 w-auto childs:fill-gradient"
					variation="solid"
				/>
				<h2>{title}</h2>
				<p>{description}</p>
				<div class="flex items-center gap-4">
					{#if author}
						<ProfileLink data={author} {created} />
					{:else}
						<Tag
							class={clsx(
								draft ? 'bg-gray-300 text-gray-600' : 'bg-emerald-300 text-emerald-600'
							)}
						>
							{draft ? 'Черновик' : 'Публичный'}
						</Tag>
					{/if}
					<Likes {storyId} {likes} />
				</div>
			</svelte:fragment>
		</ReadCard>
		{#each $framesStore as { frameId }, key}
			{@const last = key === $framesStore.length - 1}
			<Frame
				{frameId}
				on:click={({ detail }) => setChoice(frameId, detail.choiceId)}
				selectedChoiceId={data.progress[key].choiceId}
				class={clsx(!last && 'pointer-events-none opacity-10')}
			/>
		{/each}
	</div>
</div>
