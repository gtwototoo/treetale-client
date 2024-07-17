<script lang="ts">
	import { clm } from '$lib/utils/classMerge';
	import { preventDefault } from '$lib/utils/eventsModificators';
	import { validateMimeType } from '$lib/utils/inputAccept';
	import type {
		ChangeEventHandler,
		DragEventHandler,
		EventHandler,
		HTMLButtonAttributes,
		HTMLInputAttributes,
		MouseEventHandler,
		SvelteDocumentAttributes
	} from 'svelte/elements';
	import DashedBorder from './DropArea/DashedBorder.svelte';

	let {
		class: classname,
		accept = 'image/*',
		children,
		onclick,
		ondragenter,
		ondragleave,
		onvisibilitychange,
		onchange
	}: Pick<HTMLInputAttributes, 'accept'> &
		Pick<SvelteDocumentAttributes, 'onvisibilitychange'> &
		Pick<HTMLButtonAttributes, 'class' | 'children' | 'ondragenter' | 'onclick'> & {
			onchange?: (files: File[]) => void;
			ondragleave?: () => void;
		} = $props();

	let dragged = $state(false);
	let inputElement = $state<HTMLInputElement>();

	const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();

		inputElement?.click();

		onclick?.(e);
	};

	const handleDragEnter: DragEventHandler<HTMLButtonElement> = (e) => {
		if (!e.dataTransfer) return;

		e.dataTransfer.dropEffect = 'copy';

		dragged = true;

		ondragenter?.(e);
	};

	const handleDragLeave = () => {
		dragged = false;

		ondragleave?.();
	};

	const handleVisibilityChange: EventHandler<Event, Document> = (e) => {
		handleDragLeave();

		onvisibilitychange?.(e);
	};

	const handleDrop: DragEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();

		setFiles(e.dataTransfer?.files as FileList);

		handleDragLeave();
	};

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		e.preventDefault();

		setFiles((e.target as HTMLInputElement).files as FileList);
	};

	const setFiles = (files: FileList) => {
		if (inputElement) inputElement.value = '';

		onchange?.([...files].filter((file) => validateMimeType(file, accept)));
	};
</script>

<svelte:document onvisibilitychange={handleVisibilityChange} />

<div class={clm('inset-0 z-10 size-full gap-2 p-4 text-sm', classname)}>
	<button
		onclick={handleClick}
		ondragenter={handleDragEnter}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		ondragover={preventDefault}
		class="group relative flex size-full flex-col items-center justify-center gap-[inherit] rounded-xl bg-main-30 p-4 text-text *:pointer-events-none *:bg-transparent"
	>
		<DashedBorder {dragged} />
		{@render children?.()}
	</button>
	<input bind:this={inputElement} onchange={handleChange} class="hidden" type="file" {accept} />
</div>
