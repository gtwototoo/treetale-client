<script lang="ts">
	import clsx from 'clsx';
	import { createEventDispatcher, onMount } from 'svelte';

	let dragged: boolean = false;
	let dispatch = createEventDispatcher();

	const handleDrop = (e: DragEvent) => {
		disableDragged();
		dispatch('drop', e);
	};

	const handleDragEnter = ({
		dataTransfer
	}: DragEvent & {
		currentTarget: EventTarget & HTMLDivElement;
	}) => {
		if (!dataTransfer) return;

		dataTransfer.dropEffect = 'copy';
		dragged = true;
	};

	const disableDragged = () => (dragged = false);

	onMount(() => {
		document.addEventListener('visibilitychange', disableDragged);

		return () => {
			document.removeEventListener('visibilitychange', disableDragged);
		};
	});
</script>

<div
	class={clsx('dropArea', dragged ? 'ring-blue-500' : 'ring-gray-200')}
	on:dragenter={handleDragEnter}
	on:dragleave={disableDragged}
	on:drop={handleDrop}
	on:dragover={disableDragged}
>
	<slot />
</div>

<style lang="postcss">
	.dropArea {
		@apply !pointer-events-auto !visible absolute z-[2] flex h-full w-full items-center justify-center rounded-lg bg-gray-50 p-4 text-center ring-1 transition-[box-shadow];
	}
</style>
