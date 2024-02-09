<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { Button } from '$UI';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { bodyColorStore } from '$lib/stores/main';
	import { rootStyle } from '$lib/utils';

	$: isNotFound = $page.status === 404;
	$: $bodyColorStore = $page.error?.color;

	const handleClick = () => {
		isNotFound ? goto('/', { replaceState: true }) : location.reload();
	};

	$: ({ img, message } = $page.error);
</script>

<svelte:head>
	<title>{isNotFound ? 'Страница не найдена' : 'Произошла ошибка'}</title>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

{#if $page.error}
	<div class="absolute flex h-full w-full items-start justify-center overflow-auto">
		<div class="flex min-h-full items-center p-4 py-20 max-sm:p-3">
			<ReadCard alt="Ошибка" src={img} text={message}>
				<div class="w-full">
					<Button
						class="adaptive-font adaptive-padding w-full bg-main !text-text"
						on:click={handleClick}
						variant="ghost"
					>
						{isNotFound ? 'Вернуться в начало' : 'Попытаться еще'}
					</Button>
				</div>
			</ReadCard>
		</div>
	</div>
{/if}
