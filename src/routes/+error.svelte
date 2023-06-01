<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { bodyColorStore } from '$lib/stores/main';
	import { rootStyle } from '$lib/utils';
	import { Button } from '$UI';
	import { ArrowPath, Home } from 'svelte-heros-v2';

	$: isNotFound = $page.status === 404;
	$: $bodyColorStore = $page.error?.color;

	const handleClick = () => (isNotFound ? location.replace('/') : location.reload());
</script>

<svelte:head>
	<title>{isNotFound ? 'Страница не найдена' : 'Произошла ошибка'}</title>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

{#if $page.error}
	<ReadCard src={$page.error.img} alt="Ошибка" text={$page.error.message}>
		<div class="cardButtons">
			<Button class="w-full justify-center gap-4" size="xl" on:click={handleClick}>
				<Icon type={isNotFound ? Home : ArrowPath} />
				<p>{isNotFound ? 'Вернуться в начало' : 'Попытаться еще'}</p>
			</Button>
		</div>
	</ReadCard>
{/if}
