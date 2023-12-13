<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { readonlyStore } from '$lib/stores/editing';
	import { changesHistory } from '$lib/stores/history';
	import { currentPanelStore } from '$lib/stores/main';
	import {
		activeActionStore,
		activeModeStore,
		connectionStore,
		framesDataStore,
		oneDirectionModeStore,
		selectedFrameStore
	} from '$lib/stores/workspace';
	import { FrameSettings } from '../Panel';

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

		const switchSelectedFrame = () => {
			if (!$selectedFrameStore) return;

			const frameKey = $framesDataStore.findIndex(
				({ frameId }) => frameId === $selectedFrameStore
			);

			const nextFrame =
				frameKey + 1 in $framesDataStore ? $framesDataStore[frameKey + 1] : $framesDataStore[0];

			$selectedFrameStore = nextFrame.frameId;

			$currentPanelStore = {
				id: `frame-${nextFrame.frameId}`,
				title: nextFrame.title || 'Начало',
				component: FrameSettings
			};
		};

		const enableOneDirectionMode = () => {
			$oneDirectionModeStore = true;
		};

		const switchConnectMode = () => {
			if (shiftKey) return;

			$activeModeStore = $activeModeStore === 'binding' ? 'view' : 'binding';
			$connectionStore = null;
		};

		const historyManipulate = () => {
			changesHistory[shiftKey ? 'redo' : 'undo']();
		};

		const cancelModes = () => {
			$activeModeStore = 'view';
		};

		let actions: Record<string, () => void>;

		if ($readonlyStore) {
			actions = {
				Tab: switchSelectedFrame
			};
		} else {
			actions = {
				KeyF: switchAddFrameMode,
				ShiftLeft: enableOneDirectionMode,
				ShiftRight: enableOneDirectionMode,
				KeyC: switchConnectMode,
				KeyZ: historyManipulate,
				Escape: cancelModes,
				Tab: switchSelectedFrame
			};
		}

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
