<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	import clsx from 'clsx';

	import { Button } from '$UI';

	export let disabled = false;

	let className = '';
	export { className as class };

	let dragged = false;
	let fileInput: HTMLInputElement;

	const dispatch = createEventDispatcher<{
		change: FileList;
		click: MouseEvent;
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

		dispatch('change', files);
	};

	onMount(() => {
		document.addEventListener('visibilitychange', disableDragged);

		return () => {
			document.removeEventListener('visibilitychange', disableDragged);
		};
	});
</script>

<Button
	class={clsx(
		'flex-col !whitespace-normal bg-contrast-9 !p-6',
		{ '!bg-main-40': dragged },
		className
	)}
	{disabled}
	on:click={handleClick}
	on:dragenter={handleDragEnter}
	on:dragleave={disableDragged}
	on:drop={addedFiles}
	variant="ghost"
>
	<slot />
	<p>Нажмите тут или перетащите сюда изображение</p>
</Button>
<input accept="image/*" bind:this={fileInput} class="hidden" on:change={addedFiles} type="file" />
