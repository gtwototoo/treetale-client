<script lang="ts">
	import { changesHistory, connect } from '$lib/stores/editing';
	import {
		activeActionStore,
		dragImageModeStore,
		oneDirectionModeStore
	} from '$lib/stores/workspace';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const handleKeydown = (e: KeyboardEvent) => {
		switch (e.key.toLowerCase()) {
			case 'm':
				e.preventDefault();

				$activeActionStore = 'adding';

				break;
			case 'shift':
				e.preventDefault();

				$oneDirectionModeStore = true;
				$connect.active = false;
				break;
			case !e.shiftKey && 'c':
				e.preventDefault();

				$connect.active = true;
				break;
			case 'z':
				if ($activeActionStore === 'adding') changesHistory[e.shiftKey ? 'redo' : 'undo']();
				break;
			case 'escape':
				e.preventDefault();

				if ($dragImageModeStore) {
					$dragImageModeStore = false;
				}
		}
	};

	const handleKeyup = (e: KeyboardEvent) => {
		switch (e.key.toLowerCase()) {
			case 'shift':
				$oneDirectionModeStore = false;
				break;
			case 'c':
				$connect = {
					active: false,
					connector: {
						from: null,
						to: null,
						prevOutput: null,
						mouseCoords: null
					}
				};
				break;
		}
	};

	const disableDragMode = () => {
		$dragImageModeStore = false; // попробовать переделать на $activeActionStore === 'drag';
	};

	const enableDragMode = () => {
		$dragImageModeStore = true;
	};

	const handleDragLeave = (e: DragEvent) => {
		if (e.relatedTarget === workspace) {
			disableDragMode();
		}
	};

	const handleMouseUp = (e: MouseEvent) => {
		dispatch('mouseup', e);
	};

	export let workspace: HTMLDivElement;
</script>

<svelte:window
	on:keypress|stopPropagation
	on:keydown={handleKeydown}
	on:mouseup={handleMouseUp}
	on:keyup|preventDefault={handleKeyup}
	on:drop|preventDefault|stopPropagation={disableDragMode}
	on:dragover|preventDefault
	on:dragend|preventDefault={disableDragMode}
	on:dragenter|preventDefault={enableDragMode}
	on:dragleave|preventDefault={handleDragLeave}
/>
