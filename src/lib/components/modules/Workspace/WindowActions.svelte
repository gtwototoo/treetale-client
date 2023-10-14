<script lang="ts">
	import { changesHistory, connect } from '$lib/stores/editing';
	import { activeActionStore, oneDirectionModeStore } from '$lib/stores/workspace';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const handleKeydown = (e: KeyboardEvent) => {
		const { code, shiftKey } = e;

		const inputFocus =
			document.hasFocus() &&
			(document.activeElement instanceof HTMLInputElement ||
				(document.activeElement as HTMLDivElement).isContentEditable);

		const switchAddFrameMode = () => {
			$activeActionStore = $activeActionStore === 'adding' ? 'view' : 'adding';
		};

		const enableOneDirectionMode = () => {
			$oneDirectionModeStore = true;
		};

		const enableConnectMode = () => {
			if (shiftKey) return;

			$activeActionStore = 'binding';
		};

		const historyManipulate = () => {
			changesHistory[shiftKey ? 'redo' : 'undo']();
		};

		const cancelModes = () => {
			$activeActionStore = 'view';
		};

		const actions: Record<string, () => void> = {
			KeyF: switchAddFrameMode,
			ShiftLeft: enableOneDirectionMode,
			ShiftRight: enableOneDirectionMode,
			KeyC: enableConnectMode,
			KeyZ: historyManipulate,
			Escape: cancelModes
		};

		if (!(code in actions) || inputFocus) return;

		e.preventDefault();

		actions[code]();
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
		$activeActionStore = 'view';
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
