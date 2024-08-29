<script lang="ts">
	import { page } from '$app/stores';
	import { connectedWithStart } from '$board/components/methods.svelte';
	import { publishStory, reviewRequestStory } from '$board/requests/story';
	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { storyInfoStore } from '$board/stores/info.svelte';
	import { Check } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import { currentThemeClass, redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { correctWhitespace } from '$lib/utils/text';

	let loading = $state(false);

	const switchReview = async () => {
		if (!storyInfoStore.info) return;

		loading = true;

		try {
			await reviewRequestStory(storyInfoStore.info.storyId);

			storyInfoStore.info.status = storyInfoStore.info.status === 'draft' ? 'review' : 'draft';
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	};

	const setPublishedStory = async () => {
		if (!storyInfoStore.info) return;

		loading = true;

		try {
			const { message } = await publishStory(storyInfoStore.info.storyId);

			storyInfoStore.info.status = 'published';
			storyInfoStore.info.version = message.version;
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	};

	let requirements = $derived([
		{
			title: 'Заголовок',
			value:
				storyInfoStore.info?.title &&
				storyInfoStore.info.title.length &&
				storyInfoStore.info.title.length <= 25
		},
		{
			title: 'Описание',
			value: storyInfoStore.info?.description.length
		},
		{
			title: 'Теги',
			value: storyInfoStore.info?.tags.length
		},
		{
			title: 'Начало и конец',
			value: boardFramesStore.frames.some(({ frameId }) => connectedWithStart(frameId))
		}
	]);

	let orangeBackgroundColor = $derived(
		currentThemeClass(clm('bg-orange-950'), clm('bg-orange-50'))
	);
	let greenBackgroundColor = $derived(
		currentThemeClass(clm('bg-emerald-950'), clm('bg-emerald-50'))
	);
	let greenBackgroundColorButton = $derived(
		currentThemeClass(
			clm('bg-emerald-700 hover:bg-emerald-800'),
			clm('bg-emerald-200 hover:bg-emerald-100')
		)
	);

	let showPublishButton = $derived(
		!readonlyModeStore.isEnabled ||
			(($page.data.session.role === 'admin' || $page.data.session.role === 'moderator') &&
				storyInfoStore.info?.status !== 'draft')
	);
</script>

{#if showPublishButton}
	<div
		class={clm(
			'flex select-none flex-col gap-2 rounded-lg p-2 text-center text-sm',
			storyInfoStore.info?.status === 'review'
				? clm('text-orange-500', orangeBackgroundColor)
				: clm('text-emerald-500', greenBackgroundColor)
		)}
	>
		{#if storyInfoStore.info?.status === 'draft'}
			<div class="grid grid-cols-2 gap-2 p-2">
				{#each requirements as requirement}
					<div class="flex items-center gap-2">
						<div
							class={clm(
								'size-5 rounded-full p-1',
								requirement.value ? greenBackgroundColorButton : 'bg-contrast'
							)}
						>
							{#if requirement.value}
								<Icon class="size-3" this={Check} />
							{/if}
						</div>
						{requirement.title}
					</div>
				{/each}
			</div>
			<Button
				class={clm('justify-center text-emerald-500', greenBackgroundColorButton)}
				{loading}
				disabled={requirements.some(({ value }) => !value)}
				onclick={switchReview}
			>
				Опубликовать
			</Button>
		{:else if storyInfoStore.info?.status === 'review'}
			{#if $page.data.session.role === 'member'}
				<p class="p-2">
					{correctWhitespace(
						'История находится на модерации. Проверка занимает обычно от часа до суток в зависимости от размера созданной или измененной истории'
					)}
				</p>
				<Button
					class={clm('justify-center', redBackgroundColorStore.color)}
					{loading}
					onclick={switchReview}
				>
					Отменить публикацию
				</Button>
			{:else}
				<p class="p-2">
					{correctWhitespace(
						'Перед тем как опубликовать историю, проверьте историю на наличие грамматических ошибок, логики связей и на наличие неприемлемого контента'
					)}
				</p>
				<Button
					class={clm('justify-center text-emerald-500', greenBackgroundColorButton)}
					{loading}
					onclick={setPublishedStory}
				>
					Опубликовать
				</Button>
			{/if}
		{:else if storyInfoStore.info?.status === 'published'}
			<p class="p-2">
				{correctWhitespace(`История опубликована (Версия ${storyInfoStore.info.version})`)}
			</p>
			<Button
				class={clm('justify-center', redBackgroundColorStore.color)}
				{loading}
				onclick={switchReview}
			>
				Отменить публикацию
			</Button>
		{/if}
	</div>
{/if}
