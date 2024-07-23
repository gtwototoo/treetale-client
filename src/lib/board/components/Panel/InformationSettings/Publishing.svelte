<script lang="ts">
	import { page } from '$app/stores';
	import { publishStory, reviewRequestStory } from '$board/requests/story';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { storyInfoStore } from '$board/stores/info.svelte';
	import { Button } from 'treetale-ui';

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
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	};

	const setPublishedStory = async () => {
		if (!storyInfoStore.info) return;

		loading = true;

		try {
			await publishStory(storyInfoStore.info.storyId);

			storyInfoStore.info.status = 'published';
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	};

	let orangeBackgroundColor = $derived(
		currentThemeClass(clm('bg-orange-950'), clm('bg-orange-50'))
	);
	let greenBackgroundColor = $derived(
		currentThemeClass(clm('bg-emerald-950'), clm('bg-emerald-50'))
	);
	let greenBackgroundColorButton = $derived(
		currentThemeClass(clm('bg-emerald-950'), clm('bg-emerald-200'))
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
			'flex select-none flex-col gap-4 rounded-lg p-4 text-center text-sm',
			storyInfoStore.info?.status === 'review'
				? clm('text-orange-500', orangeBackgroundColor)
				: clm('text-emerald-500', greenBackgroundColor)
		)}
	>
		{#if storyInfoStore.info?.status === 'draft'}
			<p>
				{correctWhitespace(
					'Перед публикацией убедитесь, что у вас присутствует заголовок, описание и выбран жанр, а также есть начало и концы истории'
				)}
			</p>
			<Button
				class={clm('justify-center text-emerald-500', greenBackgroundColorButton)}
				{loading}
				onclick={switchReview}
			>
				Опубликовать
			</Button>
		{:else if storyInfoStore.info?.status === 'review'}
			{#if $page.data.session.role === 'member'}
				<p>
					{correctWhitespace(
						'История находится на модерации. Проверка занимает обычно от часа до суток в зависимости от размера созданной или измененной истории'
					)}
				</p>
				<Button
					class={clm('justify-center text-red-500', redBackgroundColorStore.color)}
					{loading}
					onclick={switchReview}
				>
					Отменить публикацию
				</Button>
			{:else}
				<p>
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
			{correctWhitespace('История опубликована')}
			<Button
				class={clm('justify-center text-red-500', redBackgroundColorStore.color)}
				{loading}
				onclick={switchReview}
			>
				Отменить публикацию
			</Button>
		{/if}
	</div>
{/if}
