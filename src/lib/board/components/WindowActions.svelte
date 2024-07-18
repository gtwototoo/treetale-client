<script lang="ts">
	import type { DragEventHandler, KeyboardEventHandler, MouseEventHandler } from 'svelte/elements';

	import { connectionStartStore } from '$board/stores/frames.svelte';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import {
		boardStateStore,
		oneDirectionModeStore,
		readonlyModeStore
	} from '$board/stores/index.svelte';

	import { preventDefault, stopPropagation } from '$lib/utils/eventsModificators';

	import { nextSelectedFrame } from './methods.svelte';

	let {
		onmouseup,
		workspace
	}: {
		onmouseup: MouseEventHandler<Window>;
		workspace: HTMLDivElement | undefined;
	} = $props();

	const handleKeydown = (e: KeyboardEvent) => {
		const { code, shiftKey } = e;

		const inputFocus =
			document.hasFocus() &&
			(document.activeElement instanceof HTMLInputElement ||
				(document.activeElement as HTMLDivElement).isContentEditable);

		const switchAddFrameMode = () => {
			boardStateStore.mode = boardStateStore.mode === 'adding' ? 'view' : 'adding';
		};

		const enableOneDirectionMode = () => {
			oneDirectionModeStore.isEnabled = true;
		};

		const switchConnectMode = () => {
			if (shiftKey) return;

			boardStateStore.mode = boardStateStore.mode === 'binding' ? 'view' : 'binding';
			connectionStartStore.clear();
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

	const handleKeyUp: KeyboardEventHandler<Window> = (e) => {
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

		if (e.relatedTarget === workspace) {
			disableDragMode();
		}
	};

	const handleMouseUp: MouseEventHandler<Window> = (e) => {
		onmouseup(e);
	};
</script>

<svelte:window
	ondragend={(e) => {
		e.preventDefault();

		disableDragMode();
	}}
	ondragenter={enableDragMode}
	ondragleave={handleDragLeave}
	ondragover={preventDefault}
	ondrop={(e) => {
		e.preventDefault();
		e.stopPropagation();

		disableDragMode();
	}}
	onkeydown={handleKeydown}
	onkeypress={stopPropagation}
	onkeyup={handleKeyUp}
	onmouseup={handleMouseUp}
/>
