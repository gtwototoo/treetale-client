<script lang="ts">
	import { onMount } from 'svelte';

	import InformationSettings from '$board/components/Panel/InformationSettings.svelte';
	import {
		addFrameOffsetStore,
		boardFramesStore,
		movingFrameStore
	} from '$board/stores/frames.svelte';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import {
		boardEventsStore,
		boardParamsStore,
		boardStateStore,
		readonlyModeStore,
		zoomCorrect
	} from '$board/stores/index.svelte';
	import { storyInfoStore } from '$board/stores/info.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import find from 'lodash/find';
	import { ArrowsPointingIn } from 'svelte-heros-v2';

	import type { Coordinates, Frame, StartMoveParams } from '$lib/types/index';

	import { DEFAULT_FRAME_SIZE } from '$lib/constants';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { bodyBackgroundColorStore } from '$lib/stores/colors.svelte';

	import BoardArea from './Board/BoardArea.svelte';
	import {
		addFrame,
		cursorFollow,
		movingArea,
		movingFrame,
		startMoveArea
	} from './methods.svelte';

	let startOffset = $state<Coordinates>({ x: 0, y: 0 });
	let startMoveData = $state<StartMoveParams>({
		moveFrameOffset: { x: 0, y: 0 },
		moveXDirection: null,
		startMoveCoords: { x: 0, y: 0 }
	});

	const handleMouseMove = (coords: Coordinates) => {
		if (boardStateStore.action === 'movingFrame') {
			startMoveData.moveXDirection = movingFrame(coords, startMoveData);
		}
		if (boardStateStore.action === 'movingArea') {
			movingArea(coords, startOffset);
		}
		if (boardStateStore.mode === 'adding') {
			cursorFollow(coords);
		}
	};

	const startMoveFrame = (frame: Frame, coords: Coordinates): StartMoveParams => {
		if (!frame) {
			return {
				moveFrameOffset: { x: 0, y: 0 },
				moveXDirection: null,
				startMoveCoords: { x: 0, y: 0 }
			};
		}

		const { x, y } = zoomCorrect(coords);

		boardStateStore.action = 'movingFrame';

		return {
			moveFrameOffset: { x: x - frame.x, y: y - frame.y },
			moveXDirection: null,
			startMoveCoords: {
				x: frame.x,
				y: frame.y
			}
		} satisfies StartMoveParams;
	};

	const handleMouseDown = (
		e: { button: number; doubleClick: boolean; isMouse: boolean } & Coordinates
	) => {
		const { button, isMouse, x, y } = e;

		if (!isMouse || button === 0) startOffset = startMoveArea({ x, y });

		if (button === 0 && movingFrameStore.frameId) {
			const frame = find(boardFramesStore.frames, { frameId: movingFrameStore.frameId });

			if (!frame) return;

			startMoveData = startMoveFrame(frame, { x, y });
		}
	};

	const handleClick = (coords: Coordinates) => {
		if (boardStateStore.mode === 'adding' && addFrameOffsetStore.x) {
			const { x, y } = zoomCorrect(coords);

			addFrame({
				x: x - DEFAULT_FRAME_SIZE.width / 2,
				y: y - DEFAULT_FRAME_SIZE.height / 2
			});
		}
	};

	const handleMouseUp = () => {
		if (boardStateStore.action === 'movingFrame') {
			if (!movingFrameStore.frameId) return;

			const frame = find(boardFramesStore.frames, { frameId: movingFrameStore.frameId });

			if (frame) {
				frame.x = Math.round(frame.x);
				frame.y = Math.round(frame.y);
			}

			changesHistoryStore.add('Перемещение блока', ArrowsPointingIn);
		}

		if (boardStateStore.action) {
			boardStateStore.action = null;
			movingFrameStore.frameId = null;

			boardEventsStore.save();
		}
	};

	const handleZoom = () => {
		boardEventsStore.save();
	};

	const clearLiberties = (readonly: boolean) => {
		if (!readonly) return;

		if (panelStatesStore.editMode) {
			panelStatesStore.editMode = !panelStatesStore.editMode;
		}

		boardStateStore.mode = 'view';

		if (panelStatesStore.id === 'history') {
			panelStatesStore.clear();
		}
	};

	onMount(() => {
		setTimeout(() => {
			if (
				boardFramesStore.frames.length === 1 &&
				boardFramesStore.frames[0].x === 0 &&
				boardFramesStore.frames[0].y === 0
			) {
				boardFramesStore.frames[0].x =
					boardParamsStore.width / 2 - DEFAULT_FRAME_SIZE.width / 2;
				boardFramesStore.frames[0].y =
					boardParamsStore.height / 2 - DEFAULT_FRAME_SIZE.height / 2;
			}
			changesHistoryStore.init(boardFramesStore.frames);
		}, 0);

		return () => {
			panelStatesStore.clear();
		};
	});

	$effect(() => {
		clearLiberties(readonlyModeStore.isEnabled);
	});

	$effect(() => {
		if (panelStatesStore.id) return;

		panelStatesStore.set('settings', InformationSettings, {
			isEdit: true,
			title: 'Основная информация'
		});
	});

	$effect(() => {
		bodyBackgroundColorStore.color = storyInfoStore.info?.color?.length
			? storyInfoStore.info.color
			: DEFAULT_COLOR;
	});
</script>

<BoardArea
	onzoom={handleZoom}
	onmouseup={handleMouseUp}
	onclick={handleClick}
	onmousemove={handleMouseMove}
	onmousedown={handleMouseDown}
/>
