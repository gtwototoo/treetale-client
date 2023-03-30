<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { mainColor } from '$lib/stores/story';
	import { Button } from '$UI';
	import { onDestroy } from 'svelte';
	import { ArrowPath, Home } from 'svelte-heros-v2';

	$: ({ status, error } = $page);
	$: isNotFound = status === 404;

	const handleClick = () => (isNotFound ? location.replace('/') : location.reload());

	onDestroy(() => {
		mainColor.set(DEFAULT_COLOR);
	});
</script>

<svelte:head>
	<title>{isNotFound ? 'Страница не найдена' : 'Произошла ошибка'}</title>
</svelte:head>

{#if error}
	<ReadCard src={error.img} alt="Ошибка" text={error.message}>
		<div class="cardButtons">
			<Button class="w-full justify-center gap-4" size="xl" on:click={handleClick}>
				<Icon type={isNotFound ? Home : ArrowPath} />
				<p>{isNotFound ? 'Вернуться в начало' : 'Попытаться еще'}</p>
			</Button>
		</div>
	</ReadCard>
{/if}
