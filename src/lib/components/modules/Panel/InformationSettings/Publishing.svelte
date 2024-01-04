<script lang="ts">
	import { Button } from '$UI';
	import { page } from '$app/stores';
	import { publishStory, reviewRequestStory } from '$lib/requests/story';

	import { informationDataStore, readonlyStore } from '$lib/stores/editing';
	import { bodyColorStore, redColorStore } from '$lib/stores/main';
	import { contrastText, correctWhitespace } from '$lib/utils';
	import clsx from 'clsx';

	let loading = false;

	const switchReview = async () => {
		loading = true;

		try {
			await reviewRequestStory($informationDataStore.storyId);

			$informationDataStore.status =
				$informationDataStore.status === 'draft' ? 'review' : 'draft';
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	};

	const setPublishedStory = async () => {
		loading = true;

		try {
			await publishStory($informationDataStore.storyId);

			$informationDataStore.status = 'published';
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	};

	$: orangeBackground = contrastText($bodyColorStore)
		? clsx('bg-orange-950')
		: clsx('bg-orange-50');
	$: greenBackground = contrastText($bodyColorStore)
		? clsx('bg-emerald-950')
		: clsx('bg-emerald-50');
	$: greenColor = contrastText($bodyColorStore)
		? clsx('!bg-emerald-900')
		: clsx('!bg-emerald-200');
</script>

{#if !$readonlyStore || (($page.data.session.role === 'admin' || $page.data.session.role === 'moderator') && $informationDataStore.status !== 'draft')}
	<div
		class={clsx(
			'flex select-none flex-col gap-4 rounded-lg p-4 text-center text-sm',
			$informationDataStore.status === 'review'
				? clsx('text-orange-500', orangeBackground)
				: clsx('text-emerald-500', greenBackground)
		)}
	>
		{#if $informationDataStore.status === 'draft'}
			<p>
				{correctWhitespace(
					'Перед публикацией убедитесь, что у вас присутствует заголовок, описание и выбран жанр, а также есть начало и концы истории'
				)}
			</p>
			<Button
				variant="main"
				class={clsx('justify-center !text-emerald-500', greenColor)}
				on:click={switchReview}
				{loading}
			>
				Опубликовать
			</Button>
		{:else if $informationDataStore.status === 'review'}
			{#if $page.data.session.role === 'member'}
				<p>
					{correctWhitespace(
						'История находится на модерации. Проверка занимает обычно от часа до суток в зависимости от размера созданной или измененной истории'
					)}
				</p>
				<Button
					variant="main"
					class={clsx('justify-center !text-red-500', $redColorStore)}
					on:click={switchReview}
					{loading}
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
					variant="main"
					class={clsx('justify-center !text-emerald-500', greenColor)}
					on:click={setPublishedStory}
					{loading}
				>
					Опубликовать
				</Button>
			{/if}
		{:else if $informationDataStore.status === 'published'}
			{correctWhitespace('История опубликована')}
			<Button
				variant="main"
				class={clsx('justify-center !text-red-500', $redColorStore)}
				on:click={switchReview}
				{loading}
			>
				Отменить публикацию
			</Button>
		{/if}
	</div>
{/if}
