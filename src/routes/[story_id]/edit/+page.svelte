<script lang="ts">
	import { onMount } from 'svelte';

	import SvgGradient from '$lib/components/SvgGradient.svelte';
	import EditingFooter from '$lib/components/modules/Footer/EditingFooter.svelte';
	import InformationSettings from '$lib/components/modules/Panel/InformationSettings/InformationSettings.svelte';
	import CreateText from '$lib/components/modules/Workspace/CreateText.svelte';
	import Workspace from '$lib/components/modules/Workspace/Workspace.svelte';
	import {
		addFrame,
		cursorFollow,
		movingArea,
		movingFrame,
		startMoveArea
	} from '$lib/components/modules/Workspace/methods';
	import { DEFAULT_COLOR, DEFAULT_FRAME_SIZE } from '$lib/constants';
	import { updateArea } from '$lib/requests/story';
	import {
		informationDataStore,
		readonlyStore,
		stateAreaStore,
		variablesStore
	} from '$lib/stores/editing.js';
	import { changesHistory } from '$lib/stores/history.js';
	import { bodyColorStore, currentPanelStore } from '$lib/stores/main';
	import {
		activeActionStore,
		activeModeStore,
		addFrameOffsetStore,
		framesDataStore,
		movingFrameStore,
		offsetStore,
		zoomCorrect,
		zoomStore
	} from '$lib/stores/workspace';
	import type { IFrameCreate, IStartMove } from '$lib/types/editing';
	import type { ICoordinates } from '$lib/types/index';
	import { contrastText, exclude, getFrameFromId, rootStyle } from '$lib/utils';
	import { ArrowsPointingIn } from 'svelte-heros-v2';
	import { MetaTags } from 'svelte-meta-tags';

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
	framesDataStore.init(data.frames);
	$informationDataStore = data.info;
	$zoomStore = data.info.zoom;
	$offsetStore = data.info.offset;

	const handleMouseMove = (e: CustomEvent<ICoordinates>) => {
		const { x, y } = e.detail;

		if ($activeActionStore === 'movingFrame') {
			startMoveData.moveXDirection = movingFrame({ x, y }, startMoveData);
		}
		if ($activeActionStore === 'movingArea') {
			movingArea({ x, y }, startOffset);
		}
		if ($activeModeStore === 'adding') {
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
		const { x, y, isMouse, button } = e.detail;

		if (!isMouse || button === 0) startOffset = startMoveArea({ x, y });

		if (isMouse && button === 0 && $movingFrameStore) {
			const frame = getFrameFromId($framesDataStore, $movingFrameStore);

			startMoveData = startMoveFrame(frame, { x, y });
		}
	};

	const handleClick = (e: CustomEvent) => {
		const { x, y } = e.detail;

		if ($activeModeStore === 'adding' && $addFrameOffsetStore) {
			const newFrameCoords = zoomCorrect({ x, y });

			addFrame({
				x: newFrameCoords.x - DEFAULT_FRAME_SIZE.width / 2,
				y: newFrameCoords.y - DEFAULT_FRAME_SIZE.height / 2
			});
		}
	};

	const saveArea = (zoom: number, offset: ICoordinates, frames: Array<IFrameCreate>) => {
		if ($readonlyStore) {
			return;
		}

		clearTimeout(timer);
		$stateAreaStore = 'saving';

		timer = window.setTimeout(async () => {
			try {
				const correctFrames = frames.map((frame) => exclude(frame, ['height']));

				await updateArea($informationDataStore.storyId, correctFrames, offset, zoom);

				$stateAreaStore = 'saved';
			} catch {
				$stateAreaStore = 'error';
			}

			clearTimeout(timer);
		}, 3000);
	};

	const handleMouseUp = () => {
		if ($activeActionStore === 'movingFrame') {
			changesHistory.add('Перемещение фрейма', ArrowsPointingIn);
		}

		if ($activeActionStore) {
			$activeActionStore = null;
			$movingFrameStore = null;
		}
	};

	const clearLiberties = (readonly: boolean) => {
		if (!readonly) return;

		if ($currentPanelStore.editMode) {
			currentPanelStore.switchEditMode();
		}

		$activeModeStore = 'view';

		if ($currentPanelStore.id === 'history') {
			currentPanelStore.clear();
		}
	};

	onMount(() => {
		setTimeout(() => {
			if (
				$framesDataStore.length === 1 &&
				$framesDataStore[0].x === 0 &&
				$framesDataStore[0].y === 0
			) {
				$framesDataStore[0].x = width / 2 - DEFAULT_FRAME_SIZE.width / 2;
				$framesDataStore[0].y = height / 2 - DEFAULT_FRAME_SIZE.height / 2;
			}
			changesHistory.init($framesDataStore);
		}, 0);

		return () => {
			currentPanelStore.clear();
		};
	});

	$: clearLiberties($readonlyStore);

	$: if (!$currentPanelStore.component) {
		$currentPanelStore = {
			title: 'Основная информация',
			component: InformationSettings,
			id: 'settings',
			hasCloseButton: false
		};
	}

	$: saveArea($zoomStore, $offsetStore, $framesDataStore);

	$: $bodyColorStore = $informationDataStore.color.length
		? $informationDataStore.color
		: DEFAULT_COLOR;
</script>

<ska:html class="h-full" />
<svelte:body class="h-full" />

<svelte:head>
	{@html rootStyle($bodyColorStore, {
		'fill-gradient': `url(#light-gradient-${$informationDataStore.storyId})`,
		'red-custom': contrastText($bodyColorStore) ? 'rgb(127, 29, 29)' : 'rgb(254, 226, 226)'
	})}
</svelte:head>

<MetaTags title={`Редактирование "${$informationDataStore.title || 'Без названия'}"`} />

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
<EditingFooter bind:width bind:height />
