<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { validateMimeType } from '$lib/utils';

	import DropArea from './DropArea.svelte';

	export let accept = 'image/*';

	let visibleFile = false;
	let blockFile = false;

	const dispatch = createEventDispatcher<{
		change: Array<File>;
		dragstart: DragEvent;
	}>();

	const handleWindowDragEnter = (e: DragEvent) => {
		if (e.relatedTarget !== null) {
			return;
		}

		for (const item of e.dataTransfer.items) {
			if (!validateMimeType(item, accept)) {
				blockFile = true;

				return;
			}
		}

		visibleFile = true;

		dispatch('dragstart', e);
	};

	const handleChange = (e: CustomEvent<Array<File>>) => {
		visibleFile = false;

		dispatch('change', e.detail);
	};

	const handleWindowDragLeave = (e: DragEvent) => {
		if (e.x || e.y) {
			return;
		}

		visibleFile = false;
		blockFile = false;
	};
</script>

<svelte:window on:dragenter={handleWindowDragEnter} on:dragleave={handleWindowDragLeave} />

{#if visibleFile && !blockFile}
	<DropArea
		{accept}
		class="absolute bg-transparent"
		on:dragenter
		on:dragleave
		on:click
		on:change={handleChange}
		on:visibilitychange={() => (visibleFile = false)}
	>
		<slot />
	</DropArea>
{/if}
