<script lang="ts">
	import { Button } from '$UI';
	import clsx from 'clsx';
	import { createEventDispatcher, onMount } from 'svelte';

	export let disabled = false;

	let className = '';
	export { className as class };

	let dragged = false;
	let fileInput: HTMLInputElement;

	const dispatch = createEventDispatcher<{
		click: MouseEvent;
		change: { files: FileList };
	}>();

	const handleClick = (e: CustomEvent<MouseEvent>) => {
		fileInput.click();

		dispatch('click', e.detail);
	};

	const handleDragEnter = (e: DragEvent) => {
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

<Button
	variant="ghost"
	class={clsx(
		'flex-col !whitespace-normal bg-main !p-6 hover:bg-main-60',
		{ '!bg-main-60': dragged },
		className
	)}
	{disabled}
	on:click={handleClick}
	on:dragenter={handleDragEnter}
	on:dragleave={disableDragged}
	on:drop={addedFiles}
>
	<slot />
	<p>Нажмите тут или перетащите сюда изображение</p>
</Button>
<input bind:this={fileInput} class="hidden" type="file" accept="image/*" on:change={addedFiles} />
