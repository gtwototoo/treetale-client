<script lang="ts">
	import clsx from 'clsx';
	import { Photo } from 'svelte-heros-v2';

	import { Button, Image, Popover } from '$UI';

	import Icon from '../Icon.svelte';

	export let imageUrl: string;
</script>

<Popover align="left">
	<svelte:fragment let:click slot="button">
		<Button
			class={clsx(
				'h-[4.75rem] w-full flex-col gap-1 bg-contrast-9 !text-text',
				imageUrl && '!p-1'
			)}
			on:click={click}
			size="lg"
			variant="ghost"
		>
			{#if imageUrl}
				<Image
					src={imageUrl}
					alt="Мини иллюстрация истории"
					cover
					class="flex size-full flex-col rounded-lg"
				>
					<svelte:fragment slot="error">
						<Icon class="size-8 text-red-500" type={Photo} variation="solid" />
						<p class="text-xs text-red-500">Ошибка</p>
					</svelte:fragment>
				</Image>
			{:else}
				<Icon class="size-8" type={Photo} variation="solid" />
				<p class="text-xs">Иллюстрация</p>
			{/if}
		</Button>
	</svelte:fragment>
	<div class="flex w-96 flex-col gap-3 bg-transparent p-4">
		<slot />
	</div>
</Popover>
