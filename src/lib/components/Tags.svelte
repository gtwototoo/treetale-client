<script lang="ts">
	import clsx from 'clsx';

	export let tags: Array<string>;
</script>

<div
	class={clsx(
		'w-full select-none truncate rounded-xl bg-main-60 px-4 py-2 text-center text-sm',
		tags.length ? 'text-text' : 'text-gray-500'
	)}
>
	{tags.length ? tags.join(' - ') : 'Теги не указаны'}
</div>
