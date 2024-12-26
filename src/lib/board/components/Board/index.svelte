<script lang="ts">
	import { onMount } from 'svelte';

	import find from 'lodash/find';
	import { ArrowsPointingIn } from 'svelte-heros-v2';

	import {
		DEFAULT_BLOCK_WIDTH,
		DEFAULT_COMMENT_HEIGHT,
		DEFAULT_FRAME_HEIGHT
	} from '$lib/constants';
	import type { Comment, Coordinates, Frame, StartMoveParams } from '$lib/types/index';

	import InformationSettings from '$board/components/Panel/InformationSettings/index.svelte';
	import { addBlockOffsetStore, movingBlockStore } from '$board/stores/blocks.svelte';
	import { boardCommentsStore } from '$board/stores/comments.svelte';
	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import {
		boardEventsStore,
		boardParamsStore,
		boardStateStore,
		isAddingMode,
		readonlyModeStore,
		zoomCorrect
	} from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';

	import {
		addComment,
		addFrame,
		cursorFollow,
		movingArea,
		movingBlock,
		startMoveArea
	} from '../methods.svelte';

	import BoardArea from './BoardArea.svelte';

	let startOffset = $state<Coordinates>({ x: 0, y: 0 });
	let startMoveData = $state<StartMoveParams>({
		moveFrameOffset: { x: 0, y: 0 },
		moveXDirection: null,
		startMoveCoords: { x: 0, y: 0 }
	});

	const handleMouseMove = (coords: Coordinates) => {
		if (boardStateStore.action === 'movingBlock') {
			startMoveData.moveXDirection = movingBlock(coords, startMoveData);
		}
		if (boardStateStore.action === 'movingArea') {
			movingArea(coords, startOffset);
		}
		if (isAddingMode()) {
			cursorFollow(coords);
		}
	};

	const startMoveBlock = (frameCoords: Coordinates, startCoords: Coordinates): StartMoveParams => {
		const { x, y } = zoomCorrect(startCoords);

		boardStateStore.action = 'movingBlock';

		return {
			moveFrameOffset: { x: x - frameCoords.x, y: y - frameCoords.y },
			moveXDirection: null,
			startMoveCoords: {
				x: frameCoords.x,
				y: frameCoords.y
			}
		} satisfies StartMoveParams;
	};

	const getBlock = () => {
		let block: Comment | Frame | undefined;

		if (movingBlockStore.type === 'frame') {
			block = find(boardFramesStore.frames, { frameId: movingBlockStore.id! });
		} else {
			block = find(boardCommentsStore.comments, { commentId: movingBlockStore.id! });
		}

		return block;
	};

	const handleMouseDown = (
		e: {
			button: number;
			doubleClick: boolean;
			isMouse: boolean;
			touchCount: number;
		} & Coordinates
	) => {
		const { button, isMouse, x, y } = e;

		if (!isMouse || button === 0) {
			startOffset = startMoveArea({ x, y });
		}

		if (((isMouse && button === 0) || !isMouse) && movingBlockStore.id) {
			const block = getBlock();

			if (!block) return;

			startMoveData = startMoveBlock({ x: block.x, y: block.y }, { x, y });
		}
	};

	const handleClick = (coords: Coordinates) => {
		if (isAddingMode() && addBlockOffsetStore.x) {
			const { x, y } = zoomCorrect(coords);

			if (boardStateStore.mode === 'addingComment') {
				addComment({
					x: x - DEFAULT_BLOCK_WIDTH / 2,
					y: y - DEFAULT_COMMENT_HEIGHT / 2
				});
			} else {
				addFrame({
					x: x - DEFAULT_BLOCK_WIDTH / 2,
					y: y - DEFAULT_FRAME_HEIGHT / 2
				});
			}
		}
	};

	const handleMouseUp = () => {
		if (boardStateStore.action === 'movingBlock') {
			if (!movingBlockStore.id) return;

			const block = getBlock();

			if (block) {
				block.x = Math.round(block.x);
				block.y = Math.round(block.y);
			}

			changesHistoryStore.add('Перемещение блока', ArrowsPointingIn);
		}

		if (boardStateStore.action) {
			boardStateStore.action = null;

			movingBlockStore.id = null;
			movingBlockStore.type = null;

			boardEventsStore.save();
		}
	};

	const handleZoom = () => {
		boardEventsStore.save();
	};

	const clearLiberties = (readonly: boolean) => {
		if (!readonly) return;

		panelStatesStore.editMode = false;
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
				boardFramesStore.frames[0].x = boardParamsStore.width / 2 - DEFAULT_BLOCK_WIDTH / 2;
				boardFramesStore.frames[0].y = boardParamsStore.height / 2 - DEFAULT_FRAME_HEIGHT / 2;
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
</script>

<BoardArea
	onzoom={handleZoom}
	onmouseup={handleMouseUp}
	onclick={handleClick}
	onmousemove={handleMouseMove}
	onmousedown={handleMouseDown}
/>
