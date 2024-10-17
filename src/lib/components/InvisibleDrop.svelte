<script lang="ts">
	import type {
		DragEventHandler,
		HTMLButtonAttributes,
		HTMLInputAttributes,
		SvelteWindowAttributes
	} from 'svelte/elements';

	import { validateMimeType } from '$lib/utils/inputAccept';

	import { boardStateStore } from '$board/stores/index.svelte';

	import DropArea from './DropArea.svelte';

	let {
		accept = 'image/*',
		children,
		onchange,
		ondragstart,
		...props
	}: {
		onchange?: (files: File[]) => void;
		ondragleave?: () => void;
	} & Pick<HTMLButtonAttributes, 'children' | 'class' | 'onclick' | 'ondragenter'> &
		Pick<HTMLInputAttributes, 'accept'> &
		Pick<SvelteWindowAttributes, 'ondragstart'> = $props();

	let visibleFile = $state(false);
	let blockFile = $state(false);

	const handleWindowDragEnter: DragEventHandler<Window> = (e) => {
		if (e.relatedTarget !== null || !e.dataTransfer) {
			return;
		}

		for (const item of e.dataTransfer.items) {
			if (!validateMimeType(item, accept)) {
				blockFile = true;

				return;
			}
		}

		visibleFile = true;

		ondragstart?.(e);
	};

	const handleChange = (files: File[]) => {
		visibleFile = false;

		onchange?.(files);
	};

	const handleWindowDragLeave: DragEventHandler<Window> = (e) => {
		if (e.x || e.y) {
			return;
		}

		visibleFile = false;
		blockFile = false;

		boardStateStore.action = null;
	};
</script>

<svelte:window ondragenter={handleWindowDragEnter} ondragleave={handleWindowDragLeave} />

{#if visibleFile && !blockFile}
	<DropArea
		{accept}
		class="absolute rounded-2xl bg-contrast"
		{...props}
		onchange={handleChange}
		onvisibilitychange={() => (visibleFile = false)}
	>
		{@render children?.()}
	</DropArea>
{/if}
