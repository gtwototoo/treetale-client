<script lang="ts">
	import clsx from 'clsx';
	import { PencilSquare } from 'svelte-heros-v2';

	import Icon from '$lib/components/Icon.svelte';
	import { Button } from '$UI';

	let className = '';
	export { className as class };

	export let title: string;

	let editMode = false;

	const switchEditMode = () => {
		editMode = !editMode;
	};
</script>

<div
	class={clsx(
		'relative p-2 rounded-lg gap-2 select-none text-sm items-center flex flex-col',
		className
	)}
>
	<div class="flex items-center relative w-full justify-center">
		<p class="text-sm/10">{title}</p>
		<Button
			size="sm"
			variant={editMode ? 'main' : 'secondary'}
			class={clsx('!absolute right-0 z-[2] !px-1', editMode && 'bg-main text-text')}
			on:click={switchEditMode}
		>
			<Icon type={PencilSquare} class="w-4 h-4" />
		</Button>
	</div>
	<slot {editMode} />
</div>
