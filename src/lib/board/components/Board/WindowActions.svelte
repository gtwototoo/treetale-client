<script lang="ts">
	import type {
		DragEventHandler,
		KeyboardEventHandler,
		SvelteWindowAttributes
	} from 'svelte/elements';

	import { preventDefault, stopPropagation } from '$lib/utils/eventsModificators';

	import { connectionStartStore } from '$board/stores/frames.svelte';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import {
		boardStateStore,
		isAddingMode,
		isBindingMode,
		oneDirectionModeStore,
		readonlyModeStore
	} from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';

	import { nextSelectedFrame } from '../methods.svelte';

	const {
		board,
		onmouseup
	}: {
		board: HTMLDivElement;
	} & Pick<SvelteWindowAttributes, 'onmouseup'> = $props();

	const handleKeydown: KeyboardEventHandler<Window> = (e) => {
		const { code, shiftKey } = e;

		const inputFocus =
			document.hasFocus() &&
			(document.activeElement instanceof HTMLInputElement ||
				(document.activeElement as HTMLDivElement).isContentEditable);

		const switchAddFrameMode = () => {
			boardStateStore.mode = isAddingMode() ? 'view' : 'addingFrame';
		};

		const enableOneDirectionMode = () => {
			oneDirectionModeStore.isEnabled = true;
		};

		const switchEditMode = () => {
			panelStatesStore.editMode = !panelStatesStore.editMode;
		};

		const switchConnectMode = () => {
			if (shiftKey) return;

			boardStateStore.mode = isBindingMode() ? 'view' : 'binding';
			connectionStartStore.clear();

			boardStateStore.action = null;
		};

		const historyManipulate = () => {
			changesHistoryStore[shiftKey ? 'redo' : 'undo']();
		};

		const cancelModes = () => {
			boardStateStore.mode = 'view';
		};

		let actions: Record<string, () => void>;

		if (readonlyModeStore.isEnabled) {
			actions = {
				Tab: nextSelectedFrame
			};
		} else {
			actions = {
				Escape: cancelModes,
				KeyC: switchConnectMode,
				KeyE: switchEditMode,
				KeyF: switchAddFrameMode,
				KeyZ: historyManipulate,
				ShiftLeft: enableOneDirectionMode,
				ShiftRight: enableOneDirectionMode,
				Tab: nextSelectedFrame
			};
		}

		if (!(code in actions) || inputFocus) return;

		e.preventDefault();

		actions[code]();
	};

	const handleKeyup: KeyboardEventHandler<Window> = (e) => {
		e.preventDefault();

		const { code } = e;

		const disableOneDirectionMode = () => {
			oneDirectionModeStore.isEnabled = false;
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
		boardStateStore.action = null;
	};

	const enableDragMode: DragEventHandler<Window> = (e) => {
		e.preventDefault();

		boardStateStore.action = 'dragImage';
	};

	const handleDragLeave: DragEventHandler<Window> = (e) => {
		e.preventDefault();

		if (e.relatedTarget === board) {
			disableDragMode();
		}
	};

	const dragEndHandler: DragEventHandler<Window> = (e) => {
		e.preventDefault();

		disableDragMode();
	};

	const dropHandler: DragEventHandler<Window> = (e) => {
		e.preventDefault();
		e.stopPropagation();

		disableDragMode();
	};
</script>

<svelte:window
	ondragend={dragEndHandler}
	ondragenter={enableDragMode}
	ondragleave={handleDragLeave}
	ondragover={preventDefault}
	ondrop={dropHandler}
	onkeydown={handleKeydown}
	onkeypress={stopPropagation}
	onkeyup={handleKeyup}
	{onmouseup}
/>
