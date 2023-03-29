<script lang="ts">
	import { Tag } from '$UI';
	import clsx from 'clsx';

	let classes: string = '';
	export { classes as class };
	export let tags: string[];
</script>

{#if tags.length}
	<div
		class={clsx(
			'flex w-full shrink-0 justify-center gap-2 overflow-hidden bg-transparent',
			classes
		)}
	>
		{#each tags as tag}
			<Tag>{tag}</Tag>
		{/each}
	</div>
{:else}
	<p class={clsx('select-none text-xs leading-5 text-gray-500 xs:leading-6', classes)}>
		Теги не указаны
	</p>
{/if}
