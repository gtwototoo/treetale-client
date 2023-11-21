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
		'relative flex select-none flex-col items-center gap-2 rounded-lg p-2 text-sm',
		className
	)}
>
	<div class="relative flex w-full items-center justify-center">
		<p class="text-sm/10">{title}</p>
		<Button
			size="sm"
			variant={editMode ? 'main' : 'ghost'}
			class={clsx('!absolute right-0 z-[2] bg-main !px-1 text-text')}
			on:click={switchEditMode}
		>
			<Icon type={PencilSquare} class="h-4 w-4" />
		</Button>
	</div>
	<slot {editMode} />
</div>
