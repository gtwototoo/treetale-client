<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import clsx from 'clsx';

	import { validateMimeType } from '$lib/utils';

	import DashedBorder from './DashedBorder.svelte';

	let className: string | undefined = undefined;

	export { className as class };

	export let accept = 'image/*';

	let dragged = false;
	let inputElement: HTMLInputElement | undefined = undefined;

	const dispatch = createEventDispatcher<{
		change: Array<File>;
		click: MouseEvent;
		dragenter: DragEvent;
		dragleave: DragEvent | Event;
		visibilitychange: Event;
	}>();

	const handleClick = (e: MouseEvent) => {
		inputElement.click();

		dispatch('click', e);
	};

	const handleDragEnter = (e: DragEvent) => {
		e.dataTransfer.dropEffect = 'copy';

		dragged = true;

		dispatch('dragenter', e);
	};

	const handleDragLeave = (e: DragEvent | Event) => {
		dragged = false;

		dispatch('dragleave', e);
	};

	const handleVisibilityChange = (e: Event) => {
		handleDragLeave(e);

		dispatch('visibilitychange', e);
	};

	const handleDrop = (e: DragEvent | Event) => {
		let files: FileList;

		if (e instanceof DragEvent) {
			files = e.dataTransfer.files;

			handleDragLeave(e);
		} else if (e.target instanceof HTMLInputElement) {
			files = e.target.files;
		}

		dispatch(
			'change',
			[...files].filter((file) => validateMimeType(file, accept))
		);

		inputElement.value = '';
	};
</script>

<svelte:document on:visibilitychange={handleVisibilityChange} />

<div class={clsx('inset-0 z-10 size-full gap-2 p-4 text-sm', className)}>
	<button
		on:click|preventDefault={handleClick}
		on:dragenter={handleDragEnter}
		on:dragleave={handleDragLeave}
		on:drop|preventDefault={handleDrop}
		on:dragover|preventDefault
		class="group relative flex size-full flex-col items-center justify-center gap-[inherit] rounded-xl bg-main-30 p-4 *:pointer-events-none *:bg-transparent"
	>
		<DashedBorder {dragged} />
		<slot />
	</button>
	<input bind:this={inputElement} on:change={handleDrop} class="hidden" type="file" {accept} />
</div>
