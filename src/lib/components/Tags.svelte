<script lang="ts">
	import { Tag } from '$UI';
	import clsx from 'clsx';

	let className = '';
	export { className as class };

	export let tags: string[];
</script>

{#if tags.length}
	<div
		class={clsx(
			'flex w-full shrink-0 justify-center gap-2 overflow-hidden bg-transparent',
			className
		)}
	>
		{#each tags as tag}
			<Tag>{tag}</Tag>
		{/each}
	</div>
{:else}
	<p
		class={clsx(
			'select-none text-center text-xs leading-5 text-gray-500 xs:leading-6',
			className
		)}
	>
		Теги не указаны
	</p>
{/if}
