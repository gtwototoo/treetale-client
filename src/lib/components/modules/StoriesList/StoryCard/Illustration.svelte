<script lang="ts">
	import { Photo } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { BookOpen } from 'svelte-heros-v2';

	export let title: string;
	export let imageUrl: string;

	let errorImage = false;

	const handleError = () => {
		errorImage = true;
	};
</script>

<div
	class="relative flex h-56 w-full shrink-0 items-end justify-center bg-transparent text-main max-hd:h-48 max-xl:h-40 max-md:h-32 max-sm:h-24"
>
	{#if imageUrl && !errorImage}
		<Photo
			on:error={handleError}
			alt={title || 'Иллюстрация истории'}
			cover
			class="h-full w-full rounded-t-xl xs:rounded-t-2xl"
			src={imageUrl}
			width={320}
			height={192}
		/>
	{:else}
		<Icon type={BookOpen} class="h-2/3 w-auto text-contrast" variation="solid" />
	{/if}
</div>
