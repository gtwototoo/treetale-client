<script lang="ts">
	import { changesHistory } from '$lib/stores/editing';
	import {
		activeActionStore,
		activeModeStore,
		oneDirectionModeStore
	} from '$lib/stores/workspace';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const handleKeydown = (e: KeyboardEvent) => {
		const { code, shiftKey } = e;

		const inputFocus =
			document.hasFocus() &&
			(document.activeElement instanceof HTMLInputElement ||
				(document.activeElement as HTMLDivElement).isContentEditable);

		const switchAddFrameMode = () => {
			$activeModeStore = $activeModeStore === 'adding' ? 'view' : 'adding';
		};

		const enableOneDirectionMode = () => {
			$oneDirectionModeStore = true;
		};

		const switchConnectMode = () => {
			if (shiftKey) return;

			$activeModeStore = $activeModeStore === 'binding' ? 'view' : 'binding';
		};

		const historyManipulate = () => {
			changesHistory[shiftKey ? 'redo' : 'undo']();
		};

		const cancelModes = () => {
			$activeModeStore = 'view';
		};

		const actions: Record<string, () => void> = {
			KeyF: switchAddFrameMode,
			ShiftLeft: enableOneDirectionMode,
			ShiftRight: enableOneDirectionMode,
			KeyC: switchConnectMode,
			KeyZ: historyManipulate,
			Escape: cancelModes
		};

		if (!(code in actions) || inputFocus) return;

		e.preventDefault();

		actions[code]();
	};

	const handleKeyup = (e: KeyboardEvent) => {
		const { code } = e;

		const disableOneDirectionMode = () => {
			$oneDirectionModeStore = false;
		};

		const actions: Record<string, () => void> = {
			ShiftLeft: disableOneDirectionMode,
			ShiftRight: disableOneDirectionMode
		};

		if (!(code in actions)) return;

		e.preventDefault();

		actions[code]();
	};

	const disableDragMode = () => {
		$activeActionStore = null;
	};

	const enableDragMode = () => {
		$activeActionStore = 'dragImage';
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
