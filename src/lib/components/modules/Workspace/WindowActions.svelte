<script lang="ts">
	import { changesHistory, connect, storyInfo } from '$lib/stores/editing';
	import {
		activeActionStore,
		movingFrameStore,
		oneDirectionModeStore
	} from '$lib/stores/newediting';

	const handleKeydown = (e: KeyboardEvent) => {
		switch (e.key.toLowerCase()) {
			case 'm':
				e.preventDefault();
				$storyInfo.addFrameMode = true;
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
				if ($storyInfo.addFrameMode) changesHistory[e.shiftKey ? 'redo' : 'undo']();
				break;
			case 'escape':
				e.preventDefault();
				if ($storyInfo.dragImageMode) {
					$storyInfo.dragImageMode = false;
				}
		}
	};

	const handleKeyup = (e: KeyboardEvent) => {
		switch (e.key.toLowerCase()) {
			case 'm':
				$storyInfo.addFrameMode = false;
				$storyInfo.addFrameOffset = null;
				$activeActionStore = null;
				break;
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
		$storyInfo.dragImageMode = false;
	};

	const enableDragMode = () => {
		$storyInfo.dragImageMode = true;
	};

	const handleDragLeave = (e: DragEvent) => {
		if (e.relatedTarget === workspace) {
			disableDragMode();
		}
	};

	const handleMouseUp = () => {
		$movingFrameStore = null;
		$activeActionStore = 'view';
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
