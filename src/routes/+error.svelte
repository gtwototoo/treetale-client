<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import ReadCard from '$lib/components/ReadCard.svelte';
	import { bodyColorStore } from '$lib/stores/main';
	import { rootStyle } from '$lib/utils/customColors';
	import { Button } from 'treetale-ui';

	const handleClick = () => {
		isNotFound ? goto('/', { replaceState: true }) : location.reload();
	};

	let isNotFound = $derived($page.status === 404);

	$effect(() => {
		$bodyColorStore = $page.error?.color;
	});
</script>

<svelte:head>
	{@html rootStyle($bodyColorStore)}
	<title>{isNotFound ? 'Страница не найдена' : 'Произошла ошибка'}</title>
</svelte:head>

{#if $page.error}
	<div class="flex size-full items-start justify-center overflow-auto">
		<div class="flex min-h-full items-center p-4 py-20 max-sm:p-3">
			<ReadCard alt="Ошибка" src={$page.error?.img} text={$page.error?.message}>
				<div class="w-full">
					<Button
						class="adaptive-font adaptive-padding w-full bg-main !text-text"
						onclick={handleClick}
					>
						{isNotFound ? 'Вернуться в начало' : 'Попытаться еще'}
					</Button>
				</div>
			</ReadCard>
		</div>
	</div>
{/if}
