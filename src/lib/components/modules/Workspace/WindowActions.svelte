<script lang="ts">
	import { changesHistory, connect, storyInfo } from '$lib/stores/editing';
	import { activeAction, oneDirectionMode } from '$lib/stores/newediting';

	let innerHeight: number;
	let innerWidth: number;

	const handleKeydown = (e: KeyboardEvent) => {
		switch (e.key.toLowerCase()) {
			case 'm':
				e.preventDefault();
				$storyInfo.addFrameMode = true;
				break;
			case 'shift':
				e.preventDefault();
				$oneDirectionMode = true;
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
				$activeAction = null;
				break;
			case 'shift':
				$oneDirectionMode = false;
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

	export let workspace: HTMLDivElement;
</script>

<svelte:window
	bind:innerHeight
	bind:innerWidth
	on:keypress|stopPropagation
	on:keydown={handleKeydown}
	on:keyup|preventDefault={handleKeyup}
	on:drop|preventDefault|stopPropagation={disableDragMode}
	on:dragover|preventDefault
	on:dragend|preventDefault={disableDragMode}
	on:dragenter|preventDefault={enableDragMode}
	on:dragleave|preventDefault={handleDragLeave}
/>
