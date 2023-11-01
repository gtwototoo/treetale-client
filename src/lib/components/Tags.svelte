<script lang="ts">
	import clsx from 'clsx';

	export let tags: Array<string>;
</script>

<div
	class={clsx(
		'rounded-xl text-text w-full bg-main px-4 py-2 text-sm select-none text-center',
		tags.length ? 'text-text bg-main' : 'text-gray-500'
	)}
>
	{tags.length ? tags.join(' • ') : 'Теги не указаны'}
</div>
