<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import { MetaTags } from 'svelte-meta-tags';

	import MainHeader from '$lib/components/Header/MainHeader.svelte';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import RootStyles from '$lib/components/RootStyles.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	const handleClick = async () => {
		if (isNotFound) {
			await goto('/', { replaceState: true });
		} else {
			location.reload();
		}
	};

	let isNotFound = $derived(page.status === 404);
</script>

<RootStyles init={page.error?.color} />
<MetaTags title={isNotFound ? 'Страница не найдена' : 'Произошла ошибка'} />

{#if page.error}
	<div class="relative flex min-h-screen w-full flex-col">
		<MainHeader />
		<div class="flex size-full items-start justify-center overflow-auto">
			<div class="flex min-h-full w-full items-center justify-center px-4 py-20 max-sm:px-3">
				<ReadCard alt="Ошибка" src={page.error?.img} text={page.error?.message}>
					<Button
						class={clm(button.type.primary, button.size.lg, 'adaptive-font adaptive-padding')}
						onclick={handleClick}
					>
						{isNotFound ? 'Вернуться в начало' : 'Попытаться еще'}
					</Button>
				</ReadCard>
			</div>
		</div>
	</div>
{/if}
