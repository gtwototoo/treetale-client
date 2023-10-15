<script lang="ts">
	import EditingFooter from '$lib/components/modules/EditingFooter/EditingFooter.svelte';
	import Radar from '$lib/components/modules/EditingFooter/Radar.svelte';
	import { FrameSettings } from '$lib/components/modules/Panel';
	import SvgGradient from '$lib/components/modules/StoriesList/SvgGradient.svelte';
	import CreateText from '$lib/components/modules/Workspace/CreateText.svelte';
	import Workspace from '$lib/components/modules/Workspace/Workspace.svelte';
	import {
		addFrame,
		connectorLogic,
		cursorFollow,
		movingArea,
		movingFrame,
		startMoveArea
	} from '$lib/components/modules/Workspace/methods';
	import { DEFAULT_COLOR, DEFAULT_FRAME_SIZE } from '$lib/constants';
	import { updateArea } from '$lib/requests/story';
	import { changesHistory } from '$lib/stores/editing';
	import { bodyColorStore, currentPanelStore } from '$lib/stores/main';
	import { informationDataStore, stateAreaStore, variablesStore } from '$lib/stores/newediting';
	import {
		activeActionStore,
		addFrameOffsetStore,
		framesDataStore,
		movingFrameStore,
		offsetStore,
		selectedFrameStore,
		zoomCorrect,
		zoomStore
	} from '$lib/stores/workspace';

	import type { IFrameCreate, IStartMove } from '$lib/types/editing';
	import type { ICoordinates } from '$lib/types/index';
	import { getFrameFromId, rootStyle } from '$lib/utils';
	import { onMount } from 'svelte';
	import { Play, Square2Stack } from 'svelte-heros-v2';

	export let data;

	let timer: number;

	let width: number;
	let height: number;
	let startOffset: ICoordinates = { x: 0, y: 0 };
	let startMoveData: IStartMove = {
		startMoveCoords: { x: 0, y: 0 },
		moveFrameOffset: { x: 0, y: 0 },
		moveXDirection: null
	};

	$variablesStore = data.info.vars;
	$framesDataStore = data.frames;
	$informationDataStore = data.info;

	const handleMouseMove = (e: CustomEvent<ICoordinates>) => {
		const { x, y } = e.detail;

		if ($activeActionStore === 'movingFrame') {
			startMoveData.moveXDirection = movingFrame({ x, y }, startMoveData);
		}
		if ($activeActionStore === 'movingArea') {
			movingArea({ x, y }, startOffset);
		}
		if ($activeActionStore === 'adding') {
			cursorFollow({ x, y });
		}
	};

	const startMoveFrame = (frame: IFrameCreate, coords: ICoordinates): IStartMove => {
		if (!frame) {
			return {
				startMoveCoords: { x: 0, y: 0 },
				moveFrameOffset: { x: 0, y: 0 },
				moveXDirection: null
			};
		}

		const { x, y } = zoomCorrect(coords);

		$activeActionStore = 'movingFrame';

		return {
			moveFrameOffset: { x: x - frame.x, y: y - frame.y },
			startMoveCoords: {
				x: frame.x,
				y: frame.y
			},
			moveXDirection: null
		} satisfies IStartMove;
	};

	const handleMouseDown = (
		e: CustomEvent<{ doubleClick: boolean; button: number; isMouse: boolean } & ICoordinates>
	) => {
		const { x, y, isMouse, button, doubleClick } = e.detail;

		if (!isMouse || button === 1 || doubleClick) startOffset = startMoveArea({ x, y });

		if (isMouse && button === 0 && $movingFrameStore) {
			const frame = getFrameFromId($framesDataStore, $movingFrameStore);

			$selectedFrameStore = frame.frameId;

			startMoveData = startMoveFrame(frame, { x, y });

			if ($currentPanelStore.id !== `frame-${frame.frameId}`) {
				$currentPanelStore = {
					id: `frame-${frame.frameId}`,
					title: frame.title || 'Начало',
					component: FrameSettings
				};
			}
		}
	};

	const handleClick = (e: CustomEvent) => {
		const { x, y } = e.detail;

		if ($activeActionStore === 'adding' && $addFrameOffsetStore) {
			const newFrameCoords = zoomCorrect({ x, y });

			addFrame({
				x: newFrameCoords.x - DEFAULT_FRAME_SIZE.width / 2,
				y: newFrameCoords.y - DEFAULT_FRAME_SIZE.height / 2
			});
		}
	};

	const saveArea = () => {
		clearTimeout(timer);
		$stateAreaStore = 'saving';

		timer = window.setTimeout(async () => {
			try {
				await updateArea(
					$informationDataStore.storyId,
					$framesDataStore,
					$offsetStore,
					$zoomStore
				);

				$stateAreaStore = 'saved';
			} catch {
				$stateAreaStore = 'error';
			}

			clearTimeout(timer);
		}, 3000);
	};

	const handleMouseUp = () => {
		if ($activeActionStore === 'movingFrame') {
			changesHistory.add('Перемещение фрейма', Square2Stack);
		}

		$movingFrameStore = null;

		if ($activeActionStore !== 'adding') {
			$activeActionStore = 'view';

			connectorLogic();
		}

		saveArea();
	};

	onMount(() => {
		setTimeout(() => {
			if (
				$framesDataStore.length === 1 &&
				$framesDataStore[0].x === 0 &&
				$framesDataStore[0].y === 0
			) {
				$framesDataStore[0].x = width / 2 - $framesDataStore[0].width / 2;
				$framesDataStore[0].y = height / 2 - $framesDataStore[0].height / 2;
			}
			changesHistory.add('Начальное состояние', Play);
		}, 0);
	});

	$: $bodyColorStore = $informationDataStore.color.length
		? $informationDataStore.color
		: DEFAULT_COLOR;
</script>

<svelte:head>
	<title>
		Редактирование "{$informationDataStore.title || 'Без названия'}"
	</title>
	{@html rootStyle($bodyColorStore, {
		'fill-gradient': `url(#light-gradient-${$informationDataStore.storyId})`
	})}
</svelte:head>

<SvgGradient id={$informationDataStore.storyId} />
<div class="absolute h-full w-full">
	{#if $framesDataStore.length === 1}
		<CreateText />
	{/if}
	<Workspace
		bind:width
		bind:height
		on:mousedown={handleMouseDown}
		on:mouseup={handleMouseUp}
		on:mousemove={handleMouseMove}
		on:click={handleClick}
	/>
</div>
<EditingFooter>
	<Radar {width} {height} />
</EditingFooter>
