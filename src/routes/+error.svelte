<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { bodyColorStore } from '$lib/stores/main';
	import { rootStyle } from '$lib/utils';
	import { Button } from '$UI';
	import clsx from 'clsx';

	$: isNotFound = $page.status === 404;
	$: $bodyColorStore = $page.error?.color;

	const handleClick = () => {
		isNotFound ? goto('/', { replaceState: true }) : location.reload();
	};

	$: ({ img, message, theme } = $page.error);
</script>

<svelte:head>
	<title>{isNotFound ? 'Страница не найдена' : 'Произошла ошибка'}</title>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

{#if $page.error}
	<div class="flex w-full h-full justify-center items-start px-12">
		<div class="flex min-h-full items-center py-12">
			<ReadCard
				src={img}
				alt="Ошибка"
				text={message}
				classCard={clsx(theme === 'dark' && 'bg-zinc-950 text-gray-100')}
			>
				<Button
					class="w-full !bg-main !text-text adaptive-font adaptive-padding"
					variant="main"
					on:click={handleClick}
				>
					{isNotFound ? 'Вернуться в начало' : 'Попытаться еще'}
				</Button>
			</ReadCard>
		</div>
	</div>
{/if}
