<script lang="ts">
	import clsx from 'clsx';
	import { createEventDispatcher, onMount } from 'svelte';

	export { classes as class };

	let dragged = false;
	let classes = '';
	let fileInput: HTMLInputElement;

	const dispatch = createEventDispatcher();

	const handleClick = (e: MouseEvent) => {
		fileInput.click();

		dispatch('click', e);
	};

	const handleDragEnter = (e: DragEvent) => {
		console.log(e);
		e.dataTransfer.dropEffect = 'copy';
		dragged = true;
	};

	const disableDragged = () => (dragged = false);

	const addedFiles = (e: DragEvent | Event) => {
		let files: FileList;

		if (e instanceof DragEvent) files = e.dataTransfer.files;
		if (e.target instanceof HTMLInputElement) files = e.target.files;

		if (dragged) disableDragged();

		dispatch('change', { files });
	};

	onMount(() => {
		document.addEventListener('visibilitychange', disableDragged);

		return () => {
			document.removeEventListener('visibilitychange', disableDragged);
		};
	});
</script>

<button
	class={clsx(
		'flex select-none flex-col items-center justify-center rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-400 transition-colors hover:bg-white childs:pointer-events-none',
		{ '!bg-blue-50': dragged },
		classes
	)}
	on:click|preventDefault={handleClick}
	on:dragenter={handleDragEnter}
	on:dragleave={disableDragged}
	on:drop={addedFiles}
>
	<slot />
	<p>Нажмите тут или перетащите сюда изображение</p>
</button>
<input bind:this={fileInput} class="hidden" type="file" accept="image/*" on:change={addedFiles} />
